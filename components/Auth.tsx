
import React, { useState } from 'react';
import { Fingerprint, Mail, Lock, User, ArrowRight, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: (userData: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getRegisteredUsers = () => {
    const users = localStorage.getItem('certify_ai_users');
    return users ? JSON.parse(users) : [];
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const users = getRegisteredUsers();

    setTimeout(() => {
      if (isLogin) {
        const user = users.find((u: any) => u.email === email);
        if (!user) {
          setError("Identity not found. Registration required.");
          setIsLogin(false);
          setIsLoading(false);
          return;
        }
        // Logic for login: standard entry
        onLogin(user);
      } else {
        const userExists = users.some((u: any) => u.email === email);
        if (userExists) {
          setError("Node already exists. Please access portal.");
          setIsLogin(true);
          setIsLoading(false);
          return;
        }
        // Registration: Send OTP
        setShowOtpStep(true);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock OTP verification (always 123456 for demo)
    setTimeout(() => {
      if (otp === '123456') {
        const users = getRegisteredUsers();
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: name || 'User',
          email,
          role: 'VERIFIER',
          institution: 'Personal Registry'
        };
        const updatedUsers = [...users, newUser];
        localStorage.setItem('certify_ai_users', JSON.stringify(updatedUsers));
        onLogin(newUser);
      } else {
        setError("Invalid verification code. Access denied.");
      }
      setIsLoading(false);
    }, 1000);
  };

  if (showOtpStep) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        <div className="w-full max-w-lg bg-white rounded-[48px] shadow-2xl border border-slate-100 relative z-10 overflow-hidden animate-in zoom-in-95">
          <div className="bg-black p-14 text-center">
            <div className="inline-flex p-5 bg-white rounded-[28px] mb-8">
              <KeyRound className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Verify Identity</h1>
            <p className="text-slate-400 font-medium tracking-tight">An encrypted code was sent to <span className="text-white">{email}</span></p>
          </div>
          <form onSubmit={handleOtpVerify} className="p-12 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 text-center block w-full">6-Digit Verification Code</label>
              <input 
                type="text" 
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456" 
                className="w-full text-center py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-0 focus:border-black outline-none transition-all font-black text-3xl tracking-[0.5em] text-black"
              />
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Demo Code: 123456</p>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-6 bg-black hover:bg-slate-800 text-white rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center justify-center space-x-4 active:scale-95 disabled:opacity-50">
              {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><span className="uppercase tracking-widest">Verify & Initialize</span><CheckCircle2 className="w-5 h-5" /></>}
            </button>
            <button type="button" onClick={() => setShowOtpStep(false)} className="w-full text-xs font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest">Back to Credentials</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
      <div className="w-full max-w-lg bg-white rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 overflow-hidden">
        <div className="bg-black p-14 text-center">
          <div className="inline-flex p-5 bg-white rounded-[28px] mb-8 shadow-2xl">
            <Fingerprint className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">certifyAI</h1>
          <p className="text-slate-400 font-medium tracking-tight">{isLogin ? 'Enter Secure Protocol' : 'Initialize Forensic Identity'}</p>
        </div>
        <form onSubmit={handleInitialSubmit} className="p-12 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-bold text-red-700 leading-tight">{error}</p>
            </div>
          )}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Identity Name</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Pierce" 
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-[24px] focus:ring-0 focus:border-black outline-none transition-all font-bold text-lg text-black placeholder:text-slate-300"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Secure Email Node</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-black transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="protocol@certify.ai" 
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-[24px] focus:ring-0 focus:border-black outline-none transition-all font-bold text-lg text-black placeholder:text-slate-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Encrypted Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-black transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-[24px] focus:ring-0 focus:border-black outline-none transition-all font-bold text-lg text-black placeholder:text-slate-300"
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-6 bg-black hover:bg-slate-800 text-white rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center justify-center space-x-4 active:scale-95 disabled:opacity-50">
            {isLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><span className="uppercase tracking-widest">{isLogin ? 'Access Portal' : 'Register Node'}</span><ArrowRight className="w-5 h-5" /></>}
          </button>
          <div className="pt-2 text-center">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-xs font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest">{isLogin ? "No Credentials? Initialize Identity" : "Already Identified? Log In"}</button>
          </div>
        </form>
      </div>
      <p className="mt-12 text-slate-300 text-[11px] font-black uppercase tracking-[0.4em] text-center">certifyAI CORE v1.0 • Forensic Verification System</p>
    </div>
  );
};

export default Auth;
