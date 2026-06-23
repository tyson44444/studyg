
import { GenerateCareerReportOutput } from "@/ai/flows/generate-career-report";

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
