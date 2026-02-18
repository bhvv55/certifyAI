
import React from 'react';
import { 
  Fingerprint, 
  ShieldAlert, 
  ShieldQuestion, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Hash,
  ArrowLeft,
  Info,
  Search,
  Scale,
  BrainCircuit,
  FileSearch,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';
import { VerificationResult, VerificationStatus } from '../types';

interface VerificationResultProps {
  result: VerificationResult;
  onBack: () => void;
  theme: string;
  onToggleFavorite?: (result: VerificationResult) => void;
  isFavorite?: boolean;
}

const VerificationResultComponent: React.FC<VerificationResultProps> = ({ 
  result, 
  onBack, 
  theme,
  onToggleFavorite,
  isFavorite
}) => {
  const getStatusConfig = () => {
    switch (result.status) {
      case VerificationStatus.GENUINE:
        return { 
          icon: CheckCircle2, 
          color: theme === 'light' ? 'text-black' : 'text-current', 
          accent: 'bg-black',
          bg: theme === 'light' ? 'bg-slate-50' : 'bg-white/5', 
          border: theme === 'light' ? 'border-black' : 'border-current', 
          label: 'Authentic Verified',
          desc: 'certifyAI Neural Core has confirmed validity.',
          action: 'Audit successful'
        };
      case VerificationStatus.SUSPICIOUS:
        return { 
          icon: ShieldQuestion, 
          color: 'text-amber-500', 
          accent: 'bg-amber-500',
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20', 
          label: 'Requires Review',
          desc: 'Ambiguous patterns detected in forensic layers.',
          action: 'Flag for manual check'
        };
      case VerificationStatus.FAKE:
        return { 
          icon: ShieldAlert, 
          color: 'text-rose-500', 
          accent: 'bg-rose-500',
          bg: 'bg-rose-500/10', 
          border: 'border-rose-500/20', 
          label: 'Forgery Detected',
          desc: 'Critical manipulation identified in core audit.',
          action: 'Verification rejected'
        };
    }
  };

  const cardClasses = {
    light: "bg-white border-slate-100",
    dark: "bg-slate-800 border-slate-700 shadow-xl",
    night: "bg-[#111] border-[#222] shadow-2xl",
    reading: "bg-[#efe5cf] border-[#dcd0b3] shadow-md"
  };

  const config = getStatusConfig();

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-colors group px-4 py-2 hover:bg-current/5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back to Terminal</span>
        </button>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={() => onToggleFavorite?.(result)}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 border rounded-2xl font-bold transition-all shadow-sm ${
              isFavorite 
                ? 'bg-rose-500 border-rose-500 text-white' 
                : (theme === 'light' ? 'bg-white border-slate-200 text-slate-400 hover:text-rose-500' : 'bg-white/5 border-white/10 text-white/50 hover:text-rose-400')
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="text-xs uppercase tracking-widest">{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
          <button className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 border rounded-2xl opacity-60 hover:opacity-100 font-bold transition-all shadow-sm ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
            <Download className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Export</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-2xl font-black hover:opacity-80 transition-all shadow-lg">
            <ExternalLink className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Archive Log</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className={`p-8 md:p-12 rounded-[40px] border-2 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-10 transition-colors duration-500 ${config.border} ${config.bg}`}>
             <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative mb-4">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" className="opacity-10" />
                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * result.confidenceScore) / 100} className={`${config.color} transition-all duration-1500 ease-out`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black leading-none ${config.color}`}>{Math.round(result.confidenceScore)}%</span>
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Audit Index</span>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full ${config.accent} text-white text-[10px] font-black uppercase tracking-widest shadow-lg`}>Forensic Consensus</div>
             </div>
             <div className="flex-1 pt-2 text-center md:text-left">
               <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
                 <div className="space-y-2">
                    <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase ${config.color}`}>{config.label}</h2>
                    <p className="opacity-60 text-lg font-medium max-w-xl">{config.desc}</p>
                 </div>
                 <div className={`p-4 rounded-3xl shadow-sm text-center min-w-[180px] border ${theme === 'light' ? 'bg-white border-slate-100' : 'bg-black/20 border-white/5'}`}>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Audit Status</p>
                    <p className={`text-xs font-black uppercase ${config.color}`}>{config.action}</p>
                 </div>
               </div>
               <div className={`mt-8 p-6 rounded-[32px] border backdrop-blur-md shadow-sm ${theme === 'light' ? 'bg-white/60 border-white' : 'bg-black/20 border-white/10'}`}>
                  <h4 className="text-[10px] font-black opacity-40 uppercase tracking-widest flex items-center justify-center md:justify-start space-x-2 mb-3">
                    <BrainCircuit className="w-4 h-4" />
                    <span>Neural Trace Log</span>
                  </h4>
                  <p className="font-medium leading-relaxed text-lg">{result.summaryExplanation}</p>
               </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className={`rounded-[40px] border shadow-sm overflow-hidden ${cardClasses[theme as keyof typeof cardClasses]}`}>
             <div className={`px-8 py-6 border-b flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest">Extracted Entity Data</h3>
                <div className="flex items-center space-x-2 text-[10px] font-black opacity-40 uppercase">
                   <FileSearch className="w-4 h-4" />
                   <span>Source: Invariant</span>
                </div>
             </div>
             <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                {[
                  { label: 'Candidate Name', value: result.extractedData.candidateName, icon: User },
                  { label: 'Issuing Body', value: result.extractedData.institution, icon: Building2 },
                  { label: 'Qualification', value: result.extractedData.qualification, icon: FileText },
                  { label: 'Issue Date', value: result.extractedData.issueDate, icon: Calendar },
                  { label: 'Unique Registry ID', value: result.extractedData.certificateId, icon: Hash },
                  { label: 'Internal Ref', value: result.id, icon: Search },
                ].map((field, idx) => (
                  <div key={idx} className="flex items-start space-x-5">
                    <div className="mt-1 p-3 bg-current/5 rounded-2xl opacity-40 border border-current/10">
                       <field.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">{field.label}</p>
                       <p className="text-lg font-black leading-tight uppercase tracking-tighter">{field.value}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="space-y-4">
            <h3 className="px-6 text-[10px] font-black opacity-40 uppercase tracking-widest">Forensic Decomposition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {result.indicators.map((ind, idx) => (
                <div key={idx} className={`p-6 rounded-[32px] border transition-all shadow-sm ${cardClasses[theme as keyof typeof cardClasses]}`}>
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 rounded-xl bg-current/5 text-current">
                            {ind.type === 'text' && <FileText className="w-4 h-4" />}
                            {ind.type === 'visual' && <FileSearch className="w-4 h-4" />}
                            {ind.type === 'font' && <Search className="w-4 h-4" />}
                            {ind.type === 'signature' && <BrainCircuit className="w-4 h-4" />}
                            {ind.type === 'metadata' && <Info className="w-4 h-4" />}
                         </div>
                         <h4 className="font-black text-[10px] uppercase tracking-widest">{ind.label}</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${ind.score > 80 ? 'text-current' : 'text-rose-500'}`}>{ind.score}% MATCH</span>
                   </div>
                   <p className="text-xs opacity-60 leading-relaxed font-medium mb-4">{ind.explanation}</p>
                   <div className="space-y-1.5">
                     {ind.detectedIssues.map((issue, i) => (
                       <div key={i} className="flex items-center space-x-2 text-[9px] text-rose-500 font-black bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 uppercase tracking-tighter">
                         <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                         <span className="truncate">{issue}</span>
                       </div>
                     ))}
                     {ind.detectedIssues.length === 0 && (
                       <div className="flex items-center space-x-2 text-[9px] opacity-40 font-black bg-current/5 px-3 py-1 rounded-full border border-current/10 uppercase tracking-tighter">
                         <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                         <span>No Anomalies Detected</span>
                       </div>
                     )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-black rounded-[40px] p-2 overflow-hidden shadow-2xl group">
             <div className="relative rounded-[36px] overflow-hidden border border-white/5">
                <img src={result.imageUrl} alt="Document" className="w-full opacity-90 group-hover:opacity-100 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
                      <Fingerprint className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Forensic View</span>
                   </div>
                </div>
             </div>
          </div>
          <div className={`p-8 rounded-[40px] border shadow-sm ${cardClasses[theme as keyof typeof cardClasses]}`}>
             <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-6 flex items-center space-x-2">
                <Scale className="w-4 h-4 opacity-40" />
                <span>Weighted Influence</span>
             </h3>
             <div className="space-y-6">
                {result.indicators.slice(0, 3).map((ind, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{ind.label} Impact</span>
                         <span className="text-[10px] font-black">{Math.round(ind.weight * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-current/5 rounded-full overflow-hidden">
                         <div className="h-full bg-current rounded-full" style={{ width: `${ind.weight * 100}%` }} />
                      </div>
                   </div>
                ))}
             </div>
          </div>
          <button onClick={onBack} className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all group ${theme === 'light' ? 'bg-slate-50 hover:bg-black hover:text-white border-slate-100' : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'}`}>
             <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest">Next Audit</p>
                <p className="text-[10px] font-bold opacity-50 uppercase mt-1">Ready for input</p>
             </div>
             <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationResultComponent;