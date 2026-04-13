import { useAuth } from '../context/AuthContext';
import { Search, Menu } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 flex-shrink-0 bg-bg-surface/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-100 bg-white/5 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates globally..."
            className="w-64 bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg text-sm border-2 border-bg-surface">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
