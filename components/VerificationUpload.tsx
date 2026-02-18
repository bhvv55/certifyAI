
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  Search, 
  ShieldAlert, 
  Fingerprint, 
  Cpu, 
  FileCheck2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { verifyCertificate } from '../services/geminiService';
import { VerificationResult } from '../types';

interface VerificationUploadProps {
  onVerificationComplete: (result: VerificationResult) => void;
  theme: string;
}

const VerificationUpload: React.FC<VerificationUploadProps> = ({ onVerificationComplete, theme }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { label: 'Initializing Neural Engine', icon: Cpu, detail: 'Allocating forensic computing resources...' },
    { label: 'Ingesting Metadata', icon: FileText, detail: 'Extracting textual context and field data.' },
    { label: 'Forensic Audit', icon: Search, detail: 'Scanning for visual manipulation artifacts.' },
    { label: 'Typographic Validation', icon: Fingerprint, detail: 'Analyzing font consistency and kerning.' },
    { label: 'Fusion Scoring', icon: FileCheck2, detail: 'Synthesizing indicators into final confidence index.' },
  ];

  const cardClasses = {
    light: "bg-white border-slate-100",
    dark: "bg-slate-800 border-slate-700",
    night: "bg-[#111] border-[#222]",
    reading: "bg-[#efe5cf] border-[#dcd0b3]"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File exceeds 5MB limit.");
        return;
      }
      
      setFile(selectedFile);
      
      // For images, we show a preview. For PDF/DOCX, we show an icon placeholder.
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        // Mock preview for documents
        setPreview("https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=500&auto=format&fit=crop");
      }
      setError(null);
    }
  };

  const startAnalysis = async () => {
    if (!preview || !file) return;
    setIsProcessing(true);
    setCurrentStep(0);
    const stepInterval = setInterval(() => setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev)), 1500);
    try {
      const result = await verifyCertificate(preview, file.type);
      clearInterval(stepInterval);
      setCurrentStep(steps.length - 1);
      setTimeout(() => onVerificationComplete(result), 500);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try a clearer scan.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 py-6">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
              Verify a <span className={`block italic ${theme === 'light' ? 'text-slate-300' : 'opacity-30'}`}>Certificate</span>
            </h2>
            <p className="opacity-60 font-medium text-xl max-w-lg leading-relaxed">
              Upload any educational or professional credential to check its authenticity using AI forensics.
            </p>
          </div>

          {!isProcessing ? (
            <div className={`rounded-[48px] border p-10 shadow-2xl transition-colors duration-500 ${cardClasses[theme as keyof typeof cardClasses]}`}>
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[36px] p-24 text-center cursor-pointer hover:bg-current/5 transition-all group relative overflow-hidden ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  />
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all text-white shadow-xl">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="mt-8 text-3xl font-black tracking-tighter uppercase">Drop Credential</h3>
                  <p className="mt-2 opacity-40 font-bold uppercase text-[10px] tracking-[0.3em]">PDF • JPG • PNG • DOCX (Max 5MB)</p>
                  <div className={`mt-12 flex items-center justify-center space-x-4 font-black w-fit mx-auto px-8 py-4 rounded-2xl uppercase text-[10px] tracking-widest border ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'}`}>
                     <Lightbulb className="w-5 h-5 text-current" />
                     <span>Original digital files yield 99% accuracy</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                  <div className={`relative rounded-[40px] overflow-hidden border aspect-video flex items-center justify-center shadow-inner group ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'}`}>
                    <img src={preview!} alt="Certificate Scan" className="max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                    <button onClick={() => { setFile(null); setPreview(null); setError(null); }} className="absolute top-8 right-8 p-4 bg-black/90 backdrop-blur rounded-full shadow-2xl text-white hover:bg-red-600 transition-all active:scale-90">
                      <X className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-8 left-8 flex items-center space-x-3">
                       <div className="px-5 py-2 bg-black/80 backdrop-blur rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">Forensic Preview</div>
                    </div>
                  </div>
                  <div className={`flex flex-col sm:flex-row items-center justify-between p-8 rounded-[40px] border gap-8 ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/10 border-white/5'}`}>
                    <div className="flex items-center space-x-6">
                      <div className="p-5 bg-black rounded-3xl text-white shadow-xl">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-black truncate max-w-[300px] uppercase tracking-tighter">{file?.name}</p>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Staged for Audit Protocol</p>
                      </div>
                    </div>
                    <button onClick={startAnalysis} className="w-full sm:w-auto px-14 py-6 bg-black text-white rounded-[28px] font-black text-xl hover:opacity-80 shadow-2xl transition-all flex items-center justify-center space-x-5 active:scale-95">
                      <Fingerprint className="w-7 h-7" />
                      <span className="uppercase tracking-widest">Verify Certificate</span>
                    </button>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-8 flex items-start space-x-4 p-8 bg-red-500/10 text-red-500 rounded-[32px] border border-red-500/20 animate-in slide-in-from-bottom-4">
                  <ShieldAlert className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <p className="font-black uppercase text-xs tracking-widest mb-1">Protocol Failure</p>
                    <p className="font-bold text-lg leading-tight">{error}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-black rounded-[60px] p-20 text-white shadow-2xl relative min-h-[600px] flex flex-col justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10">
                <div className="h-full bg-white transition-all duration-1000 ease-in-out shadow-[0_0_20px_white]" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
              </div>
              <div className="max-w-md mx-auto space-y-16 relative z-10">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-[44px] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(255,255,255,0.2)] animate-pulse">
                    <Cpu className="w-14 h-14 text-black" />
                  </div>
                  <h3 className="mt-12 text-5xl font-black tracking-tighter uppercase italic leading-none">Auditing</h3>
                  <p className="text-slate-500 mt-4 text-lg font-bold uppercase tracking-widest">Neural Forensics in Progress</p>
                </div>
                <div className="space-y-5">
                  {steps.map((step, idx) => (
                    <div key={idx} className={`flex items-start space-x-6 p-6 rounded-[32px] transition-all duration-700 border ${idx === currentStep ? 'bg-white/10 border-white/20 opacity-100 scale-105' : idx < currentStep ? 'opacity-30 border-transparent' : 'opacity-10 border-transparent'}`}>
                      <div className={`p-4 rounded-2xl flex-shrink-0 transition-colors duration-500 ${idx <= currentStep ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-slate-800 text-slate-500'}`}>
                        {idx < currentStep ? <FileCheck2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-1 ${idx === currentStep ? 'text-white' : 'text-slate-400'}`}>Protocol: {step.label}</span>
                        {idx === currentStep && <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-2">{step.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:block w-96 space-y-8">
           <div className={`p-10 rounded-[48px] border shadow-sm space-y-10 transition-colors duration-500 ${cardClasses[theme as keyof typeof cardClasses]}`}>
              <div className="flex items-center space-x-4">
                 <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                    <HelpCircle className="w-7 h-7" />
                 </div>
                 <h4 className="font-black text-sm uppercase tracking-[0.2em]">Guidelines</h4>
              </div>
              <ul className="space-y-10">
                 {[
                    { title: "Direct Uploads", desc: "For PDF credentials, original files generated by institutions are verified instantly." },
                    { title: "Scanning Quality", desc: "For paper certificates, ensure the camera is steady and lightning is uniform." },
                    { title: "Data Privacy", desc: "The audit session is ephemeral. Documents are processed and purged immediately." }
                 ].map((item, i) => (
                    <li key={i} className="space-y-3">
                       <p className="text-[11px] font-black uppercase tracking-[0.3em]">Module_{i+1}</p>
                       <p className="text-sm opacity-60 leading-relaxed font-medium">{item.desc}</p>
                    </li>
                 ))}
              </ul>
           </div>
           <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Fingerprint className="w-40 h-40" /></div>
              <h4 className="text-2xl font-black leading-tight uppercase tracking-tighter mb-4">Registry Protection</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Every audit is cryptographically logged for institutional compliance and historical auditing.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationUpload;
