import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import { LoginForm } from '../types';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      login(res);
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/20 blur-[128px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 blur-[128px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-6 shadow-glow-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access your ATS dashboard.</p>
        </div>

        <div className="glass-elevated p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input 
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                })} 
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} 
                placeholder="you@company.com" 
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input 
                type="password"
                {...register('password', { required: 'Password is required' })} 
                className={`input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`} 
                placeholder="••••••••" 
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2 text-base shadow-glow-brand">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
