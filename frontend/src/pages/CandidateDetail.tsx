import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Phone, Calendar, Trash2, FileText, Download } from 'lucide-react';
import { candidatesApi } from '../lib/api';
import { Candidate, PIPELINE_STAGES } from '../types';
import ScoreBadge from '../components/ScoreBadge';
import SkillChip from '../components/SkillChip';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await candidatesApi.getById(id!);
        setCandidate(res.candidate);
      } catch (error) {
        toast.error('Candidate not found');
        navigate('/candidates');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCandidate();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    setIsDeleting(true);
    try {
      await candidatesApi.delete(id!);
      toast.success('Candidate deleted');
      navigate('/candidates');
    } catch (error) {
      toast.error('Failed to delete candidate');
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as any;
    try {
      const res = await candidatesApi.updateStatus(id!, newStatus);
      setCandidate(res.candidate);
      toast.success(`Moved to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="fade-in max-w-5xl mx-auto pb-12">
      <Link to="/candidates" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">{candidate.name}</h1>
                <p className="text-brand-400 text-lg font-medium">{candidate.position || 'Applicant'}</p>
              </div>
              <ScoreBadge score={candidate.matchScore} size="lg" />
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-300 relative z-10 mb-8 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" /> {candidate.email}
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" /> {candidate.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Applied {new Date(candidate.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div>
              <h3 className="label">AI Extracted Skills</h3>
              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidate.skills.map((skill, i) => (
                    <SkillChip key={i} skill={skill} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic mt-1">
                  {candidate.matchScore === null ? 'Analysis pending...' : 'No key skills extracted.'}
                </p>
              )}
            </div>
          </div>

          <div className="glass p-6 md:p-8">
            <h3 className="label flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" /> Recruiter Notes
            </h3>
            {candidate.notes ? (
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{candidate.notes}</p>
            ) : (
              <p className="text-slate-500 text-sm italic">No notes added yet.</p>
            )}
          </div>
        </div>

        {/* Right Column - Actions & Status */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6">
            <h3 className="label mb-3">Pipeline Status</h3>
            <select 
              value={candidate.status} 
              onChange={handleStatusChange}
              className="input bg-bg-surface w-full mb-6 py-3 font-medium text-brand-300 border-white/10"
            >
              {PIPELINE_STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            <h3 className="label mb-3">Actions</h3>
            <div className="space-y-3">
              {candidate.resumeFilename && (
                <a 
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-start"
                >
                  <Download className="w-4 h-4" />
                  View Original Resume
                </a>
              )}
              
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger w-full justify-start mt-4"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete Candidate'}
              </button>
            </div>
          </div>

          {candidate.addedBy && (
            <div className="glass p-6">
              <h3 className="label mb-3">Added By</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                  {candidate.addedBy.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{candidate.addedBy.name}</p>
                  <p className="text-xs text-slate-500">{candidate.addedBy.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
