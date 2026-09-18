import React, { useState } from 'react';
import {
  X,
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
} from '../../lib/supabase';
import { useToast } from '../layout/Toast';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const config = getSupabaseConfig();

  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    const clean = (u: string) =>
      u.trim().replace(/[\/\.\s]+$/, '').replace(/\/rest\/v1$/i, '').replace(/[\/\.\s]+$/, '');
    const trimmedUrl = clean(url);
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl || !trimmedKey) {
      setTestResult({
        success: false,
        message: 'Please provide both the Supabase URL and Anon Key.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const restEndpoint = `${trimmedUrl}/rest/v1/locations?select=id&limit=1`;
      const res = await fetch(restEndpoint, {
        method: 'GET',
        headers: {
          apikey: trimmedKey,
          Authorization: `Bearer ${trimmedKey}`,
        },
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Connection successful! Tables and permissions verified.',
        });
      } else if (res.status === 401 || res.status === 403) {
        setTestResult({
          success: false,
          message:
            'Authentication failed (HTTP ' +
            res.status +
            '). Check if your Anon Key is correct.',
        });
      } else if (res.status === 404) {
        setTestResult({
          success: true,
          message:
            'Connected to Supabase! (Note: campus_locations table not found yet; make sure to run schema.sql).',
        });
      } else {
        const errorText = await res.text();
        setTestResult({
          success: false,
          message: `Supabase returned status ${res.status}: ${errorText.slice(0, 100)}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network error: Could not reach Supabase endpoint (${err.message || 'Check URL'})`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl || !trimmedKey) {
      toast({
        title: 'Missing Fields',
        description: 'Please provide both the Supabase URL and Anon Key.',
        type: 'error',
      });
      return;
    }

    saveSupabaseConfig(trimmedUrl, trimmedKey);
  };

  const handleClear = () => {
    if (window.confirm('Clear stored Supabase keys and revert to local mode?')) {
      clearSupabaseConfig();
    }
  };

  const envSnippet = `VITE_SUPABASE_URL="${url || 'https://your-project-id.supabase.co'}"\nVITE_SUPABASE_ANON_KEY="${anonKey || 'your-anon-public-key'}"`;

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    toast({
      title: 'Copied',
      description: 'Environment variables copied to clipboard.',
      type: 'success',
    });
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-black/[0.08] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-[#F5F5F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0071E3]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1D1D1F]">
                Supabase Connection Settings
              </h2>
              <p className="text-xs text-[#86868B]">
                Configure real-time cloud database syncing for VIT Digital Twin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status Alert */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isConfigured
                ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <div className="font-semibold mb-0.5">
                {isConfigured
                  ? 'Supabase Cloud Database Connected'
                  : 'Currently in Local Mode (Needs Anon Key)'}
              </div>
              <p className="text-black/70">
                {isConfigured
                  ? `Active connection to ${config.url}. Edits broadcast in real-time to all connected users.`
                  : 'Edits are currently stored only in your local browser storage. Connect Supabase to sync data with all students, publishers, and faculty.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://xyzprojectid.supabase.co"
                className="w-full px-3 py-2 text-xs rounded-lg border border-black/[0.12] bg-[#F5F5F7] focus:bg-white focus:border-[#0071E3] focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-[#86868B] mt-1">
                Found in Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project URL
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#86868B]" />
                  <span>Supabase Anon Public Key</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showKey ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> Show
                    </>
                  )}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={anonKey}
                  onChange={(e) => {
                    setAnonKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-black/[0.12] bg-[#F5F5F7] focus:bg-white focus:border-[#0071E3] focus:outline-none font-mono transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#86868B] mt-1">
                Found in Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project API Keys &rarr; <span className="font-mono text-black/80 font-semibold">anon public</span>
              </p>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Quick Test Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !url || !anonKey}
                className="px-3 py-1.5 bg-black/[0.05] hover:bg-black/[0.08] disabled:opacity-40 text-[#1D1D1F] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-[#0071E3]' : ''}`}
                />
                <span>{testing ? 'Testing connection...' : 'Test Connection'}</span>
              </button>

              {config.source === 'localStorage' && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Browser Keys</span>
                </button>
              )}
            </div>
          </div>

          {/* Guide / Instructions Box */}
          <div className="border-t border-black/[0.06] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#86868B]" />
                <span>How to Get Your Supabase Anon Key</span>
              </h3>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="text-xs text-[#86868B] space-y-1.5 list-decimal list-inside bg-[#F5F5F7] p-3 rounded-xl">
              <li>Log in to <strong className="text-[#1D1D1F]">supabase.com</strong> and open your project.</li>
              <li>In the left sidebar, click on <strong className="text-[#1D1D1F]">Project Settings (gear icon)</strong>.</li>
              <li>Select <strong className="text-[#1D1D1F]">API</strong> under Configuration.</li>
              <li>Copy the <strong className="text-[#1D1D1F]">Project URL</strong> and the <strong className="text-[#1D1D1F]">anon / public key</strong>.</li>
            </ol>

            {/* Permanent .env / Vercel copy */}
            <div className="bg-[#1D1D1F] text-white p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>For permanent configuration (.env or Vercel)</span>
                <button
                  onClick={copyEnvToClipboard}
                  className="text-white hover:text-white/80 flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {copiedEnv ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy .env
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto select-all">
                {envSnippet}
              </pre>
            </div>

            {/* RLS Permission Fix for Adding/Removing Faculty & Events */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Row Level Security (RLS) SQL Fix</span>
                </div>
                <a
                  href="https://supabase.com/dashboard/project/_/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#0071E3] hover:underline flex items-center gap-1"
                >
                  <span>Open SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                If changes to faculty, locations, or events disappear after refreshing, run the permission script in your Supabase SQL Editor once to allow web clients to save edits.
              </p>
              <button
                type="button"
                onClick={() => {
                  const sql = `-- Fix permissions in Supabase SQL Editor:
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
DROP POLICY IF EXISTS "Public full access faculty" ON public.faculty;
CREATE POLICY "Public full access faculty" ON public.faculty FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public full access locations" ON public.locations;
CREATE POLICY "Public full access locations" ON public.locations FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public full access events" ON public.events;
CREATE POLICY "Public full access events" ON public.events FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public full access announcements" ON public.announcements;
CREATE POLICY "Public full access announcements" ON public.announcements FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);`;
                  navigator.clipboard.writeText(sql);
                  toast({
                    title: 'Copied SQL Fix',
                    description: 'Paste and run in Supabase SQL Editor.',
                    type: 'success',
                  });
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy RLS Fix SQL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-black/[0.06] bg-[#F5F5F7] flex items-center justify-between">
          <span className="text-[11px] text-[#86868B]">
            Keys saved in browser will reload the app automatically.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-black/[0.1] hover:bg-black/[0.03] text-xs font-medium text-[#1D1D1F] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
