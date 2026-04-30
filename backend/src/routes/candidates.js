const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getStats,
  reScreenCandidate,
} = require('../controllers/candidateController');

const router = express.Router();

// ── Multer configuration ───────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── Validation ─────────────────────────────────────────────────
const createValidation = [
  body('name').trim().notEmpty().withMessage('Candidate name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
];

// ── Routes — all protected ─────────────────────────────────────
router.use(protect);

router.get('/stats', getStats);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.post('/', upload.single('resume'), createValidation, createCandidate);
router.patch('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);
router.post('/:id/rescreen', reScreenCandidate);

// ── Multer error handler ───────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message === 'Only PDF files are allowed.') {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
