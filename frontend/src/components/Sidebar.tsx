import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Candidates', icon: Users, path: '/candidates' },
    { name: 'Add Candidate', icon: UserPlus, path: '/candidates/new' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-bg-surface border-r border-slate-200 dark:border-white/5 flex flex-col hidden md:flex transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <div className="w-8 h-8 rounded bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center border border-brand-200 dark:border-brand-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">RecruitFlow</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive && (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                  ? 'text-brand-400 bg-brand-600/10 border border-brand-500/20 shadow-[inset_0_0_12px_rgba(124,58,237,0.1)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-1">
        <Link 
          to="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            location.pathname === '/settings' 
              ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-600/10 border border-brand-200 dark:border-brand-500/20 shadow-[inset_0_0_12px_rgba(124,58,237,0.05)] dark:shadow-[inset_0_0_12px_rgba(124,58,237,0.1)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
