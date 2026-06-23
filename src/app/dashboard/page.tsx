
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CareerProfiler } from "@/components/dashboard/CareerProfiler";
import { ReportDisplay } from "@/components/dashboard/ReportDisplay";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { GenerateCareerReportOutput } from "@/ai/flows/generate-career-report";
import { saveReport } from "@/lib/storage";

export default function DashboardPage() {
  const [report, setReport] = useState<GenerateCareerReportOutput | null>(null);

  const handleReportGenerated = (fullReport: any) => {
    setReport(fullReport);
    saveReport({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      input: fullReport.input,
      output: fullReport
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        {!report ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Guidance
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold leading-tight">
                  Design Your <span className="text-primary">Future</span> Career.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  StudyGie AI analyzes your unique skills and interests to provide a data-driven path to professional excellence.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "AI Analysis", value: "Real-time" },
                  { label: "Accuracy", value: "98.5%" },
                  { label: "Job Roles", value: "5000+" },
                  { label: "Resources", value: "Verified" }
                ].map((stat, i) => (
                  <div key={i} className="glass p-4 rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase">{stat.label}</div>
                    <div className="text-xl font-bold font-headline text-primary">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-1000">
              <CareerProfiler onReportGenerated={handleReportGenerated} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-white mb-4"
              onClick={() => setReport(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Analyze Another Profile
            </Button>
            <ReportDisplay report={report} />
          </div>
        )}
      </main>
    </div>
  );
}
