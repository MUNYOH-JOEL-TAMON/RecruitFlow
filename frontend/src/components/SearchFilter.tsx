import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  skill: string;
  setSkill: (val: string) => void;
  minScore: string;
  setMinScore: (val: string) => void;
  onClear: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  search, setSearch, skill, setSkill, minScore, setMinScore, onClear
}) => {
  const hasFilters = search || skill || minScore;

  return (
    <div className="glass p-4 flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="relative w-48 focus-within:z-10">
          <input
            type="text"
            placeholder="Filter by skill (e.g. React)..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="input"
          />
        </div>
        
        <div className="relative w-40 flex items-center gap-2">
          <span className="text-sm text-slate-400 whitespace-nowrap">Min Score:</span>
          <select 
            value={minScore} 
            onChange={(e) => setMinScore(e.target.value)}
            className="input py-2"
          >
            <option value="">Any</option>
            <option value="50">50%+</option>
            <option value="70">70%+</option>
            <option value="85">85%+</option>
          </select>
        </div>

        {hasFilters && (
          <button 
            onClick={onClear}
            className="btn-ghost text-slate-400 hover:text-white"
            title="Clear filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
