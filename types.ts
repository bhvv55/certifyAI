
export enum VerificationStatus {
  GENUINE = 'GENUINE',
  FAKE = 'FAKE',
  SUSPICIOUS = 'SUSPICIOUS'
}

export interface ForgeryIndicator {
  type: 'text' | 'visual' | 'font' | 'signature' | 'metadata';
  label: string;
  weight: number; // Dynamic weight assigned by the Fusion Engine (0.0 to 1.0)
  score: number; // Authenticity score for this specific level (0 to 100)
  explanation: string;
  detectedIssues: string[];
}

export interface ExtractedData {
  candidateName: string;
  institution: string;
  certificateId: string;
  issueDate: string;
  qualification: string;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  status: VerificationStatus;
  confidenceScore: number; // The final result of the Weighted Fusion Engine
  extractedData: ExtractedData;
  indicators: ForgeryIndicator[];
  summaryExplanation: string;
  imageUrl?: string;
  forensicMapPoints?: Array<{ x: number, y: number, label: string }>; // For visual highlighting
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'VERIFIER' | 'ADMIN';
  institution?: string;
}

export interface AppState {
  user: User | null;
  history: VerificationResult[];
  favorites: VerificationResult[];
}