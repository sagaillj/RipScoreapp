'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/auth-provider';
import { UserRole } from '../../lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, switchRole } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Add alert to debug
      alert('Login successful! Redirecting to dashboard...');
      
      // Create and click a direct link to the dashboard
      const a = document.createElement('a');
      a.href = '/app/protected/dashboard';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        
        // Last-resort fallbacks
        window.location.href = '/app/protected/dashboard';
        router.push('/app/protected/dashboard');
      }, 100);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Development-only quick role switcher
  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    
    // Add alert to debug
    alert(`Role switched to ${role}! Redirecting to dashboard...`);
    
    // Create and click a direct link to the dashboard
    const a = document.createElement('a');
    a.href = '/app/protected/dashboard';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      
      // Last-resort fallbacks
      window.location.href = '/app/protected/dashboard';
      window.location.replace('/app/protected/dashboard');
      router.push('/app/protected/dashboard');
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-midnight to-midnight/80">
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="text-3xl font-bold text-white">
              <span className="text-aqua">Rip</span>Score.app
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="p-6">
              <h1 className="mb-6 text-center text-2xl font-semibold text-white">
                Log in to your account
              </h1>

              {error && (
                <div className="mb-4 rounded bg-error/10 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-slate outline-none focus:border-aqua focus:ring-1 focus:ring-aqua"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-slate outline-none focus:border-aqua focus:ring-1 focus:ring-aqua"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate/30 bg-white/5 text-aqua focus:ring-2 focus:ring-aqua"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-slate"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-aqua hover:text-aqua/80"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-aqua px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-aqua/90 focus:outline-none focus:ring-4 focus:ring-aqua/50 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Development-only role switcher */}
              <div className="mt-8 rounded border border-dashed border-white/20 p-4">
                <div className="mb-2 text-center text-xs font-semibold uppercase text-slate">
                  Development Options
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      switchRole('coach');
                      alert('Login as Coach successful. Click OK to go to dashboard.');
                      window.location.replace('/app/protected/dashboard');
                    }}
                    className="rounded bg-success/20 px-3 py-1 text-xs text-white cursor-pointer"
                  >
                    Login as Coach
                  </button>
                  <button
                    onClick={() => {
                      switchRole('diver');
                      alert('Login as Diver successful. Click OK to go to dashboard.');
                      window.location.replace('/app/protected/dashboard');
                    }}
                    className="rounded bg-aqua/20 px-3 py-1 text-xs text-white cursor-pointer"
                  >
                    Login as Diver
                  </button>
                  <button
                    onClick={() => {
                      switchRole('judge');
                      alert('Login as Judge successful. Click OK to go to dashboard.');
                      window.location.replace('/app/protected/dashboard');
                    }}
                    className="rounded bg-orange/20 px-3 py-1 text-xs text-white cursor-pointer"
                  >
                    Login as Judge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}