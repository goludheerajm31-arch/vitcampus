import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { useToast } from '../components/layout/Toast';
import { UserRole } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User as UserIcon,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, quickLoginAs, user, role } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password, selectedRole);
        if (res.success) {
          toast(`Signed in successfully as ${selectedRole}`, 'success');
          if (selectedRole === 'ADMIN') navigate('/admin');
          else if (selectedRole === 'PUBLISHER') navigate('/publisher');
          else navigate(from);
        } else {
          toast(res.error || 'Invalid credentials. Please check your email and password.', 'error');
        }
      } else {
        if (!name.trim()) {
          toast('Please enter your full name', 'error');
          setLoading(false);
          return;
        }
        const res = await register(name.trim(), email.trim(), selectedRole);
        if (res.success) {
          toast(`Account registered as ${selectedRole}!`, 'success');
          if (selectedRole === 'ADMIN') navigate('/admin');
          else if (selectedRole === 'PUBLISHER') navigate('/publisher');
          else navigate(from);
        } else {
          toast(res.error || 'Registration failed. Please try another email.', 'error');
        }
      }
    } catch (err: any) {
      toast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoRole: UserRole, demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSelectedRole(demoRole);
    setLoading(true);

    try {
      const res = await login(demoEmail, demoPass, demoRole);
      if (res.success) {
        toast(`Signed in as ${demoRole}`, 'success');
        if (demoRole === 'ADMIN') navigate('/admin');
        else if (demoRole === 'PUBLISHER') navigate('/publisher');
        else navigate('/dashboard');
      } else {
        toast(res.error || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#0071E3] mx-auto flex items-center justify-center text-white shadow-[0_4px_16px_rgba(0,113,227,0.3)]">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
          VIT Bhopal Digital Twin
        </h1>
        <p className="text-xs text-[#86868B] max-w-sm mx-auto">
          Campus navigation, faculty cabin directory, event discovery, and administration.
        </p>

        {isSupabaseConfigured() && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Cloud Supabase Auth Active</span>
          </div>
        )}
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white p-6 rounded-2xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-5">
        {/* Tab Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 p-1 bg-[#F5F5F7] rounded-xl border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="font-medium text-[#1D1D1F] flex items-center justify-between">
              <span>Account Type</span>
              <span className="text-[11px] text-[#86868B] font-normal">
                {selectedRole === 'ADMIN' ? 'Manage campus data' : selectedRole === 'PUBLISHER' ? 'Post club events' : 'Student explorer'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['STUDENT', 'PUBLISHER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 px-1 text-center rounded-xl border font-medium capitalize transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-xs'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] border-black/[0.06] hover:bg-black/[0.05]'
                  }`}
                >
                  {r.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name for Register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-medium text-[#1D1D1F] flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
                className="w-full px-3 py-2 bg-[#F5F5F7] border border-black/[0.1] rounded-xl focus:outline-none focus:bg-white focus:border-[#0071E3] text-[#1D1D1F] transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="font-medium text-[#1D1D1F] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#86868B]" />
              <span>University Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@vitbhopal.ac.in"
              required
              className="w-full px-3 py-2 bg-[#F5F5F7] border border-black/[0.1] rounded-xl focus:outline-none focus:bg-white focus:border-[#0071E3] text-[#1D1D1F] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-medium text-[#1D1D1F] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#86868B]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 bg-[#F5F5F7] border border-black/[0.1] rounded-xl focus:outline-none focus:bg-white focus:border-[#0071E3] text-[#1D1D1F] transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white font-semibold rounded-xl shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="pt-4 border-t border-black/[0.06] space-y-2.5">
          <div className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider text-center">
            Or 1-Click Quick Demo Sign-In
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('STUDENT', 'student@vitbhopal.ac.in', 'Student@123')}
              className="p-2.5 rounded-xl border border-black/[0.06] bg-[#F5F5F7] hover:bg-black/[0.05] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1D1D1F]">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Student</span>
              </div>
              <p className="text-[10px] text-[#86868B] mt-0.5 truncate">Aarav Sharma</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('PUBLISHER', 'aiclub@vitbhopal.ac.in', 'Publisher@123')}
              className="p-2.5 rounded-xl border border-black/[0.06] bg-[#F5F5F7] hover:bg-black/[0.05] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1D1D1F]">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Publisher</span>
              </div>
              <p className="text-[10px] text-[#86868B] mt-0.5 truncate">AI Club Lead</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN', 'admin@vitbhopal.ac.in', 'Admin@123')}
              className="p-2.5 rounded-xl border border-black/[0.06] bg-[#F5F5F7] hover:bg-black/[0.05] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1D1D1F]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-[#86868B] mt-0.5 truncate">Dr. S. K. Gupta</p>
            </button>
          </div>
        </div>

        {/* Guest link */}
        <div className="pt-2 text-center border-t border-black/[0.06]">
          <Link
            to="/explore"
            className="text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            Continue as Guest Explorer &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
