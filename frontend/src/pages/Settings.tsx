import React from 'react';
import { User, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fade-in max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account preferences and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 border-r border-slate-200 dark:border-white/10 pr-4">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 transition-colors">
              <User className="w-4 h-4" /> Account
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Shield className="w-4 h-4" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Database className="w-4 h-4" /> Integrations
            </button>
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-8">
          
          {/* Profile Section */}
          <section className="glass p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input bg-slate-100 dark:bg-black/20 text-slate-500 cursor-not-allowed" value={user?.name || ''} readOnly />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input bg-slate-100 dark:bg-black/20 text-slate-500 cursor-not-allowed" value={user?.email || ''} readOnly />
                </div>
              </div>
              <div>
                <label className="label">Role</label>
                <input type="text" className="input bg-slate-100 dark:bg-black/20 text-slate-500 cursor-not-allowed capitalize w-1/2" value={user?.role || ''} readOnly />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Please contact your administrator to update profile details.</p>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="glass p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Preferences</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200">Application Theme</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Switch between Light and Dark mode globally.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </section>

          {/* Integrations Section */}
          <section className="glass p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Smart Screener API (Beta)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Configure the endpoint for your Python FastAPI backend machine learning model here.</p>
            
            <div className="space-y-4">
              <div>
                <label className="label">NLP Service Endpoint URL</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="https://api.your-ml-service.com/v1/parse" 
                  defaultValue="http://localhost:8000/parse"
                />
              </div>
              <div className="flex justify-end">
                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Settings;
