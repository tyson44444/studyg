
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

export function saveReport(report: SavedReport) {
  if (typeof window === 'undefined') return;
  const existing = getReports();
  const updated = [report, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getReports(): SavedReport[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteReport(id: string) {
  if (typeof window === 'undefined') return;
  const existing = getReports();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
