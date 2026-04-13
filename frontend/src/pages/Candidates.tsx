import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { candidatesApi } from '../lib/api';
import { Candidate } from '../types';
import SearchFilter from '../components/SearchFilter';
import ScoreBadge from '../components/ScoreBadge';
import SkillChip from '../components/SkillChip';

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [minScore, setMinScore] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await candidatesApi.getAll({ 
        search, 
        skill, 
        minScore: minScore ? Number(minScore) : undefined,
        page,
        limit: 20
      });
      setCandidates(res.candidates);
      setTotalPages(res.pages);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, skill, minScore, page]);

  const handleClearFilters = () => {
    setSearch('');
    setSkill('');
    setMinScore('');
    setPage(1);
  };

  return (
    <div className="fade-in max-w-6xl mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Candidates</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Browse, search, and manage your entire talent pool.</p>
        </div>
        <Link to="/candidates/new" className="btn-primary">
          <UserPlus className="w-4 h-4" />
          Add Candidate
        </Link>
      </div>

      <SearchFilter 
        search={search} setSearch={setSearch} 
        skill={skill} setSkill={setSkill} 
        minScore={minScore} setMinScore={setMinScore} 
        onClear={handleClearFilters}
      />

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Candidate</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match Score</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Top Skills</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No candidates found</td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <tr key={c._id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.position || c.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">{c.status}</span>
                    </td>
                    <td className="p-4">
                      <ScoreBadge score={c.matchScore} size="sm" />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {c.skills?.slice(0, 3).map((s, i) => (
                          <SkillChip key={i} skill={s} />
                        ))}
                        {(!c.skills || c.skills.length === 0) && <span className="text-slate-600 text-xs">-</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/candidates/${c._id}`} className="btn-ghost">
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary px-3 py-1 text-xs"
              >Prev</button>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary px-3 py-1 text-xs"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
