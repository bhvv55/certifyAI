
import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileSearch,
  ArrowRight,
  Fingerprint,
  Activity,
  Globe,
  Plus,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { VerificationResult, VerificationStatus } from '../types';

interface DashboardProps {
  history: VerificationResult[];
  onNavigate: (view: string) => void;
  theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onNavigate, theme }) => {
  const stats = [
    { label: 'Total Audits', value: history.length, icon: FileSearch, color: 'text-current', bg: 'bg-current/5' },
    { label: 'Authentic', value: history.filter(v => v.status === VerificationStatus.GENUINE).length, icon: CheckCircle2, color: 'text-current', bg: 'bg-current/5' },
    { label: 'Suspicious', value: history.filter(v => v.status === VerificationStatus.SUSPICIOUS).length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Flagged', value: history.filter(v => v.status === VerificationStatus.FAKE).length, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const areaData = [
    { name: '01', genuine: 12, risk: 2 },
    { name: '05', genuine: 18, risk: 4 },
    { name: '10', genuine: 25, risk: 3 },
    { name: '15', genuine: 15, risk: 8 },
    { name: '20', genuine: 32, risk: 5 },
    { name: '25', genuine: 28, risk: 2 },
    { name: '30', genuine: 45, risk: 6 },
  ];

  const cardClasses = {
    light: "bg-white border-slate-100",
    dark: "bg-slate-800 border-slate-700 shadow-xl",
    night: "bg-[#111] border-[#222] shadow-2xl",
    reading: "bg-[#efe5cf] border-[#dcd0b3] shadow-md"
  };

  const chartColor = theme === 'light' ? '#000000' : theme === 'reading' ? '#5b4636' : '#ffffff';

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
             <div className="px-2 py-0.5 bg-black text-[10px] font-black text-white rounded uppercase tracking-widest shadow-sm">Live System</div>
             <div className="flex items-center space-x-1 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                <Globe className="w-3 h-3" />
                <span>Central Core #0822</span>
             </div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Audit Summary</h2>
          <p className="opacity-60 font-medium text-lg">System-wide performance metrics.</p>
        </div>
        <button 
          onClick={() => onNavigate('upload')}
          className="group px-8 py-4 bg-black text-white rounded-2xl font-black hover:opacity-80 transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Audit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`group p-8 rounded-[40px] border shadow-sm transition-all hover:scale-105 ${cardClasses[theme as keyof typeof cardClasses]}`}>
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-3xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="w-1 h-1 bg-current rounded-full animate-pulse opacity-20" />
            </div>
            <div className="mt-8">
              <h3 className="text-5xl font-black tracking-tighter leading-none">{stat.value}</h3>
              <p className="text-[10px] font-black opacity-40 mt-3 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-10 rounded-[48px] border shadow-sm ${cardClasses[theme as keyof typeof cardClasses]}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
            <h3 className="text-xl font-black flex items-center space-x-3 uppercase tracking-tighter">
              <Activity className="w-5 h-5" />
              <span>Volume Trends</span>
            </h3>
            <div className={`flex items-center space-x-6 p-2 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
               <div className="flex items-center space-x-2 px-3">
                  <div className="w-3 h-3 rounded-full bg-current" />
                  <span className="text-[10px] font-black opacity-40 uppercase">Valid</span>
               </div>
               <div className="flex items-center space-x-2 px-3 border-l border-current/10">
                  <div className="w-3 h-3 rounded-full opacity-30 bg-current" />
                  <span className="text-[10px] font-black opacity-40 uppercase">Risk</span>
               </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#f1f5f9' : '#ffffff05'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartColor, fontSize: 10, fontWeight: 800, opacity: 0.4}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: chartColor, fontSize: 10, fontWeight: 800, opacity: 0.4}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', background: theme === 'light' ? '#fff' : '#222', color: chartColor, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="genuine" stroke={chartColor} strokeWidth={5} fillOpacity={1} fill="url(#colorGen)" strokeLinecap="round" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black p-10 rounded-[48px] text-white shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tighter">Recent Logs</h3>
            <Fingerprint className="w-5 h-5 text-white/30" />
          </div>
          <div className="flex-1 space-y-4 relative z-10">
            {history.slice(0, 5).map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onNavigate('history')}
                className="group flex items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.status === VerificationStatus.GENUINE ? 'bg-white' : 'bg-rose-500'}`} />
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-bold text-slate-100 truncate">{item.extractedData.candidateName}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">{item.extractedData.institution}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            ))}
            {history.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center space-y-6 py-10 opacity-30">
                <FileSearch className="w-8 h-8" />
                <p className="text-xs font-black uppercase tracking-widest text-center leading-relaxed">No active logs</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => onNavigate('history')}
            className="w-full mt-10 py-5 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest border-t border-white/5 transition-colors group flex items-center justify-center space-x-2 relative z-10"
          >
            <span>Audit Registry</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
