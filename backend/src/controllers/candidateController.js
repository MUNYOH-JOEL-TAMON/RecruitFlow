const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const { PIPELINE_STAGES } = require('../models/Candidate');
const { screenResume } = require('../services/screener');

// ── GET /api/candidates ────────────────────────────────────────
const getCandidates = async (req, res, next) => {
  try {
    const { skill, minScore, status, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status && PIPELINE_STAGES.includes(status)) {
      filter.status = status;
    }

    if (skill) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minScore !== undefined) {
      filter.matchScore = { $gte: Number(minScore) };
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [candidates, total] = await Promise.all([
      Candidate.find(filter)
        .populate('addedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Candidate.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      candidates,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/candidates/:id ────────────────────────────────────
const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('addedBy', 'name email');
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    res.json({ success: true, candidate });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/candidates ───────────────────────────────────────
const createCandidate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Cleanup uploaded file on validation failure
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, phone, position, notes, jobDescription } = req.body;

    // Build resume URL if a file was uploaded
    let resumeUrl = '';
    let resumeFilename = '';
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
      resumeFilename = req.file.originalname;
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      position,
      notes,
      jobDescription,
      resumeUrl,
      resumeFilename,
      skills: [],       // Will be populated by ML screener
      matchScore: null, // Will be populated by ML screener
      addedBy: req.user._id,
    });

    // ── Gemini ML Screener (async — does not block response) ───
    if (req.file) {
      // Pass resumeUrl directly — screener resolves path internally (fixes Windows bug)
      screenResume(candidate.resumeUrl, candidate.jobDescription)
        .then(async ({ skills, matchScore }) => {
          await Candidate.findByIdAndUpdate(candidate._id, { skills, matchScore });
          console.log(`🤖 Screened candidate ${candidate._id}: score=${matchScore}`);
        })
        .catch((err) => {
          console.error('❌ Screener async error for candidate', candidate._id, ':', err.message);
        });
    }
    // ─────────────────────────────────────────────────────────────

    res.status(201).json({ success: true, candidate });
  } catch (error) {
    next(error);
  }
};

// ── PATCH /api/candidates/:id ──────────────────────────────────
const updateCandidate = async (req, res, next) => {
  try {
    const { status, notes, skills, matchScore, position, phone, name, email } = req.body;

    // Validate status if provided
    if (status && !PIPELINE_STAGES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${PIPELINE_STAGES.join(', ')}`,
      });
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (skills !== undefined) updates.skills = skills;
    if (matchScore !== undefined) updates.matchScore = matchScore;
    if (position !== undefined) updates.position = position;
    if (phone !== undefined) updates.phone = phone;
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('addedBy', 'name email');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    res.json({ success: true, candidate });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/candidates/:id ─────────────────────────────────
const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Remove resume file from disk
    if (candidate.resumeUrl) {
      const filePath = path.join(__dirname, '../../', candidate.resumeUrl);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Could not delete resume file:', err.message);
        }
      });
    }

    await candidate.deleteOne();
    res.json({ success: true, message: 'Candidate deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/candidates/stats ──────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [stageCounts, total, withScore] = await Promise.all([
      Candidate.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Candidate.countDocuments(),
      Candidate.countDocuments({ matchScore: { $ne: null } }),
    ]);

    const stats = {
      total,
      withScore,
      stages: {},
    };

    PIPELINE_STAGES.forEach((stage) => {
      stats.stages[stage] = 0;
    });

    stageCounts.forEach(({ _id, count }) => {
      stats.stages[_id] = count;
    });

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/candidates/:id/rescreen ─────────────────────────
const reScreenCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    if (!candidate.resumeUrl) {
      return res.status(400).json({ message: 'No resume uploaded for this candidate.' });
    }

    // Pass resumeUrl directly — screener resolves path internally (fixes Windows bug)
    let skills, matchScore;
    try {
      ({ skills, matchScore } = await screenResume(candidate.resumeUrl, candidate.jobDescription));
    } catch (screenerErr) {
      console.error('❌ Screener error:', screenerErr.message);
      return res.status(500).json({
        message: `Screening failed: ${screenerErr.message}`,
      });
    }

    const updated = await Candidate.findByIdAndUpdate(
      candidate._id,
      { skills, matchScore },
      { new: true }
    ).populate('addedBy', 'name email');

    res.json({ success: true, candidate: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getStats,
  reScreenCandidate,
};
