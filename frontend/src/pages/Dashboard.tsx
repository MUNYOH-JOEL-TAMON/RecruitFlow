import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { candidatesApi } from '../lib/api';
import { Candidate, StatsResponse } from '../types';
import KanbanBoard from '../components/KanbanBoard';
import StatCard from '../components/StatCard';
import SearchFilter from '../components/SearchFilter';

const Dashboard = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [minScore, setMinScore] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [candidatesRes, statsRes] = await Promise.all([
        candidatesApi.getAll({ 
          search, 
          skill, 
          minScore: minScore ? Number(minScore) : undefined,
          limit: 100 // fetch more for dashboard
        }),
        candidatesApi.getStats()
      ]);
      setCandidates(candidatesRes.candidates);
      setStats(statsRes.stats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [search, skill, minScore]);

  const handleMoveCandidate = async (candidateId: string, newStatus: string) => {
    // Optimistic UI update
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidateId ? { ...c, status: newStatus as any } : c))
    );

    try {
      await candidatesApi.updateStatus(candidateId, newStatus);
      // Refresh stats in background
      candidatesApi.getStats().then(res => setStats(res.stats));
    } catch (error) {
      toast.error('Failed to move candidate');
      // Revert on error
      fetchDashboardData();
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSkill('');
    setMinScore('');
  };

  return (
    <div className="flex flex-col h-full fade-in pb-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-brand-400" />
              Pipeline Overview
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage and track your candidates through the hiring process.</p>
          </div>
        </div>
        
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Candidates" value={stats.total} icon={Users} />
            <StatCard title="Smart Screened" value={stats.withScore} icon={CheckCircle} />
            <StatCard title="Total Applied" value={stats.stages.Applied} icon={FileText} />
            <StatCard title="Hired" value={stats.stages.Hired} icon={CheckCircle} />
          </div>
        )}
      </div>

      <SearchFilter 
        search={search} setSearch={setSearch} 
        skill={skill} setSkill={setSkill} 
        minScore={minScore} setMinScore={setMinScore} 
        onClear={handleClearFilters}
      />

      <div className="flex-1 overflow-hidden mt-4">
        {isLoading && candidates.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <KanbanBoard candidates={candidates} onMoveCandidate={handleMoveCandidate} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
