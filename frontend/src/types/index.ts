// ── Pipeline Stages ────────────────────────────────────────────
export const PIPELINE_STAGES = [
  'Applied',
  'Screened',
  'Interviewing',
  'Offered',
  'Hired',
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

// ── Stage Config ───────────────────────────────────────────────
export interface StageConfig {
  label: string;
  color: string;       // text color
  bg: string;          // background color
  border: string;      // border color
  dot: string;         // dot indicator color
}

export const STAGE_CONFIG: Record<PipelineStage, StageConfig> = {
  Applied:      { label: 'Applied',      color: 'text-slate-300',  bg: 'bg-slate-700/30',   border: 'border-slate-600/40', dot: 'bg-slate-400'  },
  Screened:     { label: 'Screened',     color: 'text-blue-400',   bg: 'bg-blue-900/20',    border: 'border-blue-700/40',  dot: 'bg-blue-400'   },
  Interviewing: { label: 'Interviewing', color: 'text-amber-400',  bg: 'bg-amber-900/20',   border: 'border-amber-700/40', dot: 'bg-amber-400'  },
  Offered:      { label: 'Offered',      color: 'text-violet-400', bg: 'bg-violet-900/20',  border: 'border-violet-700/40',dot: 'bg-violet-400' },
  Hired:        { label: 'Hired',        color: 'text-emerald-400',bg: 'bg-emerald-900/20', border: 'border-emerald-700/40',dot: 'bg-emerald-400'},
};

// ── Models ─────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter';
  avatar?: string;
  createdAt: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  status: PipelineStage;
  resumeUrl?: string;
  resumeFilename?: string;
  skills: string[];
  matchScore: number | null;
  notes?: string;
  jobDescription?: string;
  addedBy?: Pick<User, '_id' | 'name' | 'email'>;
  createdAt: string;
  updatedAt: string;
}

// ── API response shapes ────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface CandidatesResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  candidates: Candidate[];
}

export interface StatsResponse {
  success: boolean;
  stats: {
    total: number;
    withScore: number;
    stages: Record<PipelineStage, number>;
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// ── Form types ─────────────────────────────────────────────────
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'recruiter';
}

export interface AddCandidateForm {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  notes?: string;
  jobDescription?: string;
  resume?: FileList;
}
