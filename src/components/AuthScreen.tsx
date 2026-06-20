import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../supabaseClient";
import { UserProfile } from "../types";
import { KeyRound, Shield, AlertCircle, FileText, ArrowRight, Activity, Mail, Lock } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          
          if (data?.user) {
            setSuccessMsg("Account created successfully! Check your email for authentication triggers, or log in.");
            setIsSignUp(false);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          if (data?.user) {
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email || email,
            });
          }
        }
      } else {
        // DEMO MODE fallback
        setTimeout(() => {
          if (isSignUp) {
            setSuccessMsg("Success! (Demo Mode) Account simulated. You can now Log In.");
            setIsSignUp(false);
          } else {
            // Log in mock user
            onAuthSuccess({
              id: "mock-user-uuid-123456",
              email: email,
            });
          }
          setLoading(false);
        }, 600);
        return;
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      if (isSupabaseConfigured) {
        setLoading(false);
      }
    }
  };

  const loadDemoCreds = () => {
    setEmail("agency-founder@example.com");
    setPassword("founderpassword");
    setErrorMsg(null);
  };

  return (
    <div id="auth-screen" className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Upper Logo area */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-slate-900 text-white mb-4">
          <FileText className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-1000 font-sans">
          Proposal Generator
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-sans max-w-sm mx-auto">
          Create, edit, and export pristine client proposals in minutes. Made for 3-person agency teams.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 proposal-card-shadow border border-slate-150 rounded-xl sm:px-10">
          
          {/* Warn about local demo mode if applicable */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 bg-amber-50/50 border border-amber-100 rounded-lg flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Running in Live Demo Mode:</span> Supabase environment secrets are not configured yet. 
                You can register/login with any credentials instantly. Data saves to local browser storage.
                <button 
                  onClick={loadDemoCreds} 
                  type="button" 
                  className="mt-1 block font-bold underline text-amber-950 hover:text-amber-900"
                >
                  ⚡ Auto-fill demo credentials
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50/50 border border-red-150 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50/50 border border-emerald-150 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-450" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-205 rounded-lg text-slate-950 text-sm placeholder-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="name@agency.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Password
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-455" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-205 rounded-lg text-slate-950 text-sm placeholder-slate-400 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex items-center justify-center px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5 font-sans">
                    <Activity className="h-4 w-4 animate-pulse" /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    {isSignUp ? "Sign Up" : "Log In"} <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-center text-xs">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              type="button"
              className="text-slate-600 hover:text-slate-950 font-bold transition-colors border-b border-solid border-slate-300"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
