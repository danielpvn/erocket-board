'use client';

import React, { useState } from 'react';
import { Rocket, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  isDarkMode?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const validUser = 'eroketadmin';
      const validPass = 'erocketeros';

      if (username.trim() === validUser && password === validPass) {
        localStorage.setItem('erocket_auth_session', 'true');
        onLoginSuccess();
      } else {
        setError('Usuário ou senha incorretos. Verifique suas credenciais.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 z-10">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/30 mb-4 animate-bounce duration-1000">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Erocket Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mentoria Lei Seca — Acesso Restrito ao Time de Desenvolvimento
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Entrando...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Entrar no Quadro</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Acesso compartilhado com credenciais de desenvolvedor
          </p>
        </div>
      </div>
    </div>
  );
};
