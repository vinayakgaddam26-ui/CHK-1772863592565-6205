'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock, User, Mail } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed.');
        setLoading(false);
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('An unexpected network error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-carbon-primary/20 rounded-full blur-[60px]"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-carbon-primary/10 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-carbon-primary/20 flex items-center justify-center mb-4 border border-carbon-primary/30">
            <Activity className="w-6 h-6 text-carbon-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-sm text-white/50 text-center">Register to join the Global Smart City Network</p>
        </div>

        {error && (
          <div className="bg-carbon-alert/10 border border-carbon-alert/30 text-carbon-alert text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1 ml-1 uppercase tracking-wider">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/40 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-carbon-primary focus:border-carbon-primary transition sm:text-sm"
                placeholder="city_admin_01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/40 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-carbon-primary focus:border-carbon-primary transition sm:text-sm"
                placeholder="admin@carboneye.io"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-black/40 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-carbon-primary focus:border-carbon-primary transition sm:text-sm"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-carbon-primary hover:bg-carbon-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-carbon-primary disabled:opacity-50 transition shadow-[0_0_20px_rgba(123,63,228,0.3)]"
          >
            {loading ? 'Registering Node...' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-white/50">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-carbon-primary hover:text-carbon-primary/80 transition glow-text">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
