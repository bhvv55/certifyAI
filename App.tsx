
import React, { useState, useRef, useEffect } from 'react';
import { VerificationResult, AppState, User, VerificationStatus } from './types';
import Dashboard from './components/Dashboard';
import VerificationUpload from './components/VerificationUpload';
import VerificationResultComponent from './components/VerificationResult';
import Auth from './components/Auth';
import { 
  Fingerprint, 
  Users, 
  Search, 
  UserCircle, 
  LayoutDashboard, 
  History, 
  Heart, 
  Settings, 
  Phone, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Scale,
  BrainCircuit,
  FileCheck
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'night' | 'reading';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    history: [],
    favorites: [],
  });
  const [currentView, setCurrentView] = useState('upload');
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('certify_ai_favorites');
    if (savedFavorites) {
      setState(prev => ({ ...prev, favorites: JSON.parse(savedFavorites) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('certify_ai_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (userData: User) => {
    setState(prev => ({ ...prev, user: userData }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null }));
    setCurrentView('upload');
    setIsMenuOpen(false);
  };

  const onVerificationComplete = (result: VerificationResult) => {
    setState(prev => ({
      ...prev,
      history: [result, ...prev.history]
    }));
    setSelectedResult(result);
    setCurrentView('result');
  };

  const toggleFavorite = (result: VerificationResult) => {
    setState(prev => {
      const isFav = prev.favorites.some(f => f.id === result.id);
      if (isFav) {
        return { ...prev, favorites: prev.favorites.filter(f => f.id !== result.id) };
      } else {
        return { ...prev, favorites: [...prev.favorites, result] };
      }
    });
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const themeClasses = {
    light: "bg-white text-slate-900 border-slate-100",
    dark: "bg-slate-900 text-slate-100 border-slate-800",
    night: "bg-[#050505] text-[#d4d4d4] border-[#1a1a1a]",
    reading: "bg-[#f4ecd8] text-[#5b4636] border-[#e2d5b6]"
  };

  const cardClasses = {
    light: "bg-white border-slate-100 shadow-sm",
    dark: "bg-slate-800 border-slate-700 shadow-xl shadow-black/20",
    night: "bg-[#111] border-[#222] shadow-2xl",
    reading: "bg-[#efe5cf] border-[#dcd0b3] shadow-md"
  };

  const renderView = () => {
    if (currentView === 'result' && selectedResult) {
      return (
        <VerificationResultComponent 
          result={selectedResult} 
          onBack={() => setCurrentView('upload')} 
          theme={theme}
          onToggleFavorite={toggleFavorite}
          isFavorite={state.favorites.some(f => f.id === selectedResult.id)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard history={state.history} onNavigate={navigateTo} theme={theme} />;
      case 'upload':
        return <VerificationUpload onVerificationComplete={onVerificationComplete} theme={theme} />;
      case 'history':
      case 'favorites':
        const displayData = currentView === 'favorites' ? state.favorites : state.history;
        const title = currentView === 'favorites' ? 'Saved Audits' : 'Audit Registry';
        const subtitle = currentView === 'favorites' ? 'Your collection of starred forensic reports.' : 'Permanent log of all analyzed credentials.';

        return (
          <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
             <div className="flex justify-between items-end">
                <div>
                  <h2 className={`text-4xl font-black tracking-tighter uppercase ${theme === 'light' ? 'text-slate-900' : 'text-current'}`}>{title}</h2>
                  <p className="opacity-60 font-medium text-lg">{subtitle}</p>
                </div>
                <div className={`px-5 py-2.5 rounded-2xl flex items-center space-x-3 border ${cardClasses[theme]}`}>
                   {currentView === 'favorites' ? <Heart className="w-5 h-5 text-rose-500 fill-current" /> : <Users className="w-5 h-5 opacity-40" />}
                   <span className="text-xs font-black uppercase tracking-widest">{displayData.length} Entries</span>
                </div>
             </div>
             <div className={`rounded-[40px] border overflow-hidden shadow-2xl ${cardClasses[theme]}`}>
                <table className="w-full text-left">
                  <thead className={`border-b ${theme === 'light' ? 'bg-slate-50' : 'bg-black/20'}`}>
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Timestamp</th>
                      <th className="px-10 py-6 text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Candidate Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Qualification</th>
                      <th className="px-10 py-6 text-[10px] font-black opacity-40 uppercase tracking-[0.2em] text-center">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black opacity-40 uppercase tracking-[0.2em] text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {displayData.map((item) => (
                      <tr key={item.id} className="hover:bg-current/5 cursor-pointer transition-all" onClick={() => { setSelectedResult(item); setCurrentView('result'); }}>
                        <td className="px-10 py-7 text-xs opacity-40 font-bold">{new Date(item.timestamp).toLocaleDateString()}</td>
                        <td className="px-10 py-7 text-sm font-black">{item.extractedData.candidateName}</td>
                        <td className="px-10 py-7 text-sm opacity-60 font-medium">{item.extractedData.qualification}</td>
                        <td className="px-10 py-7 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            item.status === VerificationStatus.GENUINE ? 'bg-black text-white border-black' :
                            item.status === VerificationStatus.SUSPICIOUS ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-10 py-7 text-right font-black text-lg">{item.confidenceScore}%</td>
                      </tr>
                    ))}
                    {displayData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-10 py-32 text-center opacity-10">
                           <div className="flex flex-col items-center">
                              {currentView === 'favorites' ? <Heart className="w-16 h-16 mb-6" /> : <Search className="w-16 h-16 mb-6" />}
                              <p className="text-sm font-black uppercase tracking-[0.3em]">{currentView === 'favorites' ? 'No Saved Reports' : 'Registry Logs Empty'}</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        );
      case 'reports':
        return (
          <div className="max-w-4xl mx-auto py-10 space-y-16 animate-in slide-in-from-bottom-10 duration-700">
            <div className="space-y-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Forensic Methodology</h2>
              <p className="text-xl opacity-60 font-medium">An overview of the patented Weighted Fusion Engine and multi-level forgery detection layers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-10 rounded-[48px] border ${cardClasses[theme]}`}>
                <div className="w-16 h-16 bg-black rounded-[24px] flex items-center justify-center mb-8 shadow-xl">
                  <Scale className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Requirement #2: Weighted Fusion</h3>
                <p className="opacity-60 leading-relaxed">Our engine doesn't just look for errors; it assigns dynamic weights to every anomaly. A signature mismatch carries higher weight than a slight margin inconsistency.</p>
              </div>
              
              <div className={`p-10 rounded-[48px] border ${cardClasses[theme]}`}>
                <div className="w-16 h-16 bg-black rounded-[24px] flex items-center justify-center mb-8 shadow-xl">
                  <BrainCircuit className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Requirement #4: Adaptive Learning</h3>
                <p className="opacity-60 leading-relaxed">Unlike legacy systems, certifyAI learns layout variations. If a university updates its seal design, the engine adapts its baseline model across all future verifications.</p>
              </div>
            </div>

            <div className={`p-10 rounded-[48px] border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8 flex items-center space-x-3">
                <FileCheck className="w-5 h-5" />
                <span>Standardized Audit Protocol</span>
              </h3>
              <div className="space-y-8">
                {[
                  { l: "Layer 1: Textual Invariants", d: "OCR validation of internal logic (e.g., birthdate vs graduation date)." },
                  { l: "Layer 2: Visual Artifacts", d: "Pixel-level analysis for cloning, healing, or stamp duplication." },
                  { l: "Layer 3: Typographic Audit", d: "Checking font kerning, baseline shift, and font-family consistency." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="text-2xl font-black opacity-10">0{i+1}</div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-xs mb-1">{item.l}</h4>
                      <p className="opacity-60 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
      case 'profile':
        return (
          <div className="max-w-3xl mx-auto py-10 space-y-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter">System Configuration</h2>
            <div className="space-y-6">
              {[
                { label: "Institutional Baseline", desc: "Define your organization's core certificate templates.", toggle: true },
                { label: "Sensitivity Threshold", desc: "Adjust the score at which certificates are flagged as 'Suspicious'.", toggle: false, value: "Score: 88" },
                { label: "Forensic Map Overlay", desc: "Enable visual markers for detected forgery artifacts on images.", toggle: true },
                { label: "Audit Log Retention", desc: "Number of days verified logs are kept in the Registry.", toggle: false, value: "365 Days" }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-8 rounded-[32px] border ${cardClasses[theme]}`}>
                  <div className="max-w-md">
                    <h4 className="font-black uppercase text-xs tracking-widest mb-1">{item.label}</h4>
                    <p className="opacity-40 text-sm">{item.desc}</p>
                  </div>
                  {item.toggle ? (
                    <div className="w-12 h-6 bg-black rounded-full relative shadow-inner cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-black/5 rounded-xl font-black text-[10px] uppercase tracking-widest">{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
             <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center animate-pulse ${theme === 'light' ? 'bg-slate-50 text-slate-200' : 'bg-white/5 text-white/20'}`}>
                <Settings className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black uppercase tracking-widest">Protocol Staged</h2>
             <p className="opacity-40 font-medium">This module is being finalized for your organization.</p>
             <button onClick={() => setCurrentView('upload')} className="px-8 py-3 bg-black text-white rounded-full font-black uppercase text-xs tracking-widest hover:opacity-80 transition-all">Back to Terminal</button>
          </div>
        );
    }
  };

  if (!state.user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${themeClasses[theme]} selection:bg-current selection:text-current`}>
      <nav className={`h-24 border-b px-10 flex items-center justify-between sticky top-0 z-50 transition-colors duration-500 ${themeClasses[theme]} backdrop-blur-md bg-opacity-80`}>
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigateTo('upload')}>
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
              <Fingerprint className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">certifyAI</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'upload', label: 'Verify' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'history', label: 'Registry' },
              { id: 'favorites', label: 'Saved' }
            ].map(nav => (
              <button 
                key={nav.id}
                onClick={() => navigateTo(nav.id)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-100 ${currentView === nav.id ? 'opacity-100 border-b-2 border-current pb-1' : 'opacity-40'}`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`hidden md:flex items-center p-1 rounded-full border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            {(['light', 'dark', 'night', 'reading'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-2 rounded-full transition-all ${theme === t ? 'bg-black text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                title={`${t.charAt(0).toUpperCase() + t.slice(1)} Mode`}
              >
                {t === 'light' && <Sun className="w-4 h-4" />}
                {t === 'dark' && <Moon className="w-4 h-4" />}
                {t === 'night' && <Sparkles className="w-4 h-4" />}
                {t === 'reading' && <BookOpen className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center space-x-4 p-2 pr-6 rounded-[28px] border transition-all group ${theme === 'light' ? 'hover:bg-slate-50 border-transparent hover:border-slate-100' : 'hover:bg-white/5 border-transparent hover:border-white/10'}`}
              >
                <div className="w-10 h-10 bg-black rounded-[16px] flex items-center justify-center font-black text-white text-sm shadow-lg group-hover:scale-105 transition-all">
                  {state.user.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                   <p className="text-xs font-black leading-tight uppercase tracking-tighter">{state.user.name}</p>
                </div>
                <ChevronDown className={`w-3 h-3 opacity-30 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className={`absolute right-0 mt-4 w-64 rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-200 ${cardClasses[theme]}`}>
                   <div className="px-6 py-3 mb-2 border-b border-current/5">
                      <p className="text-xs font-black truncate uppercase tracking-tighter">{state.user.name}</p>
                      <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{state.user.email}</p>
                   </div>
                   <div className="space-y-0.5 px-2">
                      {[
                        { id: 'reports', label: 'Methodology', icon: HelpCircle },
                        { id: 'settings', label: 'Configuration', icon: Settings },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${currentView === item.id ? 'bg-black text-white' : 'opacity-60 hover:opacity-100 hover:bg-current/5'}`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-xs font-bold tracking-tight">{item.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-6 py-4 bg-rose-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {renderView()}
      </main>

      <footer className="py-12 border-t border-current/5 text-center">
         <div className="flex items-center justify-center space-x-3 mb-4 opacity-10">
            <Fingerprint className="w-5 h-5" />
            <span className="font-black text-xs uppercase tracking-[0.5em]">certifyAI Systems</span>
         </div>
         <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Global Forensic Protocol • Authorized Personnel Only</p>
      </footer>
    </div>
  );
};

export default App;
