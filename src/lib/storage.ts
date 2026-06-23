
import { GenerateCareerReportOutput } from "@/ai/flows/generate-career-report";
import { doc, setDoc, Firestore, collection } from "firebase/firestore";

export interface SavedReport {
  id: string;
  timestamp: number;
  input: {
    fullName: string;
    educationBackground: string;
    skills: string[];
    interests: string[];
    careerGoal: string;
  };
  output: GenerateCareerReportOutput;
}

// Keeping local functions for backward compatibility if needed, 
// but preferring Firestore for the new logged-in experience.

export async function saveReportFirestore(db: Firestore, userId: string, report: SavedReport) {
  const reportRef = doc(collection(db, 'users', userId, 'reports'), report.id);
  await setDoc(reportRef, report);
}

// Local storage fallback (legacy)
const STORAGE_KEY = 'studygie_reports';

export function saveReportLocal(report: SavedReport) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing = stored ? JSON.parse(stored) : [];
  const updated = [report, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getReportsLocal(): SavedReport[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
