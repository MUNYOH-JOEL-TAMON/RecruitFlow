const mongoose = require('mongoose');

const PIPELINE_STAGES = ['Applied', 'Screened', 'Interviewing', 'Offered', 'Hired'];

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    position: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: PIPELINE_STAGES,
      default: 'Applied',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeFilename: {
      type: String,
      default: '',
    },
    // Populated by ML screener (stubbed for now)
    skills: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    jobDescription: {
      type: String,
      default: '',
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────
candidateSchema.index({ status: 1 });
candidateSchema.index({ skills: 1 });
candidateSchema.index({ matchScore: -1 });
candidateSchema.index({ name: 'text', email: 'text', position: 'text' });

module.exports = mongoose.model('Candidate', candidateSchema);
module.exports.PIPELINE_STAGES = PIPELINE_STAGES;
