
import React, { useState } from 'react';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user?: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | '2fa' | 'profile-setup';

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [use2FA, setUse2FA] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate hashing & verification delay
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        if (use2FA) {
          setMode('2fa');
        } else {
          onLogin();
        }
      } else if (mode === 'register') {
        setMode('2fa');
      } else if (mode === '2fa') {
        setMode('profile-setup');
      }
    }, 1200);
  };

  const handleAdminQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('2fa');
    }, 800);
  };

  const handleFinishProfile = () => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: formData.name || 'New User',
      handle: `@${(formData.name || 'user').toLowerCase().replace(/\s/g, '_')}`,
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
      bio: 'Secured account on Letago.',
      followers: 0,
      following: 0,
      isCreator: false,
      isVerified: false,
      twoFactorEnabled: use2FA,
      role: 'USER',
      status: 'active'
    };
    onLogin(newUser);
  };

  const renderLogin = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
        <div className="flex items-center justify-center gap-2 text-xs font-black text-green-600 uppercase bg-green-50 px-4 py-1.5 rounded-full w-fit mx-auto">
          <i className="fa-solid fa-shield-halved"></i> Secure Authentication Enabled
        </div>
      </div>
      <form onSubmit={handleNext} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
          <input 
            type="email" 
            name="email"
            required
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            placeholder="admin@letago.com"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
            <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-blue-600 hover:underline">Forgot?</button>
          </div>
          <div className="relative">
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium pr-12"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              <i className="fa-solid fa-lock text-xs"></i>
            </div>
          </div>
        </div>
        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : 'Secure Login'}
        </button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-300"><span className="bg-white px-4">Or Test Access</span></div>
      </div>

      <button 
        onClick={handleAdminQuickLogin}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-gray-100 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
      >
        <i className="fa-solid fa-user-shield"></i>
        Quick Access: Admin Demo
      </button>

      <p className="text-center text-sm font-medium text-gray-500 pt-4">
        New here? <button onClick={() => setMode('register')} className="text-blue-600 font-black hover:underline">Create Secure Account</button>
      </p>
    </div>
  );

  const render2FA = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl">
          <i className="fa-solid fa-key"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Verify Identity</h2>
        <p className="text-gray-500 font-medium">Any 6-digit code will work for this demo.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
        <div className="flex justify-center gap-3">
          {[...Array(6)].map((_, i) => (
            <input 
              key={i}
              type="text"
              maxLength={1}
              autoFocus={i === 0}
              className="w-10 h-14 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
              onChange={(e) => {
                if (e.target.value && e.target.nextSibling) {
                  (e.target.nextSibling as HTMLInputElement).focus();
                }
              }}
            />
          ))}
        </div>
        <button 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all"
        >
          Verify & Continue
        </button>
      </form>
      <div className="text-center space-y-4">
        <button onClick={() => setMode('login')} className="block w-full text-xs font-black text-gray