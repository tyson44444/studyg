
"use client";

import { useState } from "react";
import { Volume2, VolumeX, Download, Share2, Award, Zap, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateCareerReportOutput } from "@/ai/flows/generate-career-report";
import { readCareerReportAloud } from "@/ai/flows/read-career-report-aloud";
import { LearningRoadmap } from "./LearningRoadmap";
import { SkillGapAnalysis } from "./SkillGapAnalysis";
import { useToast } from "@/hooks/use-toast";

interface ReportDisplayProps {
  report: GenerateCareerReportOutput;
}

export function ReportDisplay({ report }: ReportDisplayProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      const textToRead = `Your top career match is ${report.careerSuggestions[0]}. Your match percentage is ${report.careerMatchPercentage}%. Your recommended job roles include ${report.topJobRoles.join(', ')}.`;
      const { media } = await readCareerReportAloud(textToRead);
      const newAudio = new Audio(media);
      setAudio(newAudio);
      newAudio.play();
      newAudio.onended = () => setIsPlaying(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Audio playback failed" });
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "career_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Report downloaded" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/20">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-2">Analysis Result</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary">Match Score: {report.careerMatchPercentage}%</Badge>
            <span className="text-muted-foreground text-sm">Generated just now by StudyGie AI</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="glass" onClick={handleSpeak}>
            {isPlaying ? <VolumeX className="text-primary" /> : <Volume2 className="text-primary" />}
          </Button>
          <Button variant="outline" size="icon" className="glass" onClick={handleDownload}>
            <Download />
          </Button>
          <Button className="bg-primary text-white">
            <Share2 className="w-4 h-4 mr-2" /> Share Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.careerSuggestions.map((career, i) => (
              <div key={i} className="glass p-5 rounded-2xl border-white/5 hover:border-primary/30 transition-all group cursor-default">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{career}</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  Highly matched with your current interest in technology and innovation.
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="roadmap" className="w-full">
            <TabsList className="glass w-full justify-start p-1 h-auto mb-6">
              <TabsTrigger value="roadmap" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary">Roadmap</TabsTrigger>
              <TabsTrigger value="certs" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary">Certifications</TabsTrigger>
              <TabsTrigger value="future" className="px-6 py-2 rounded-lg data-[state=active]:bg-primary">Future Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="roadmap">
              <LearningRoadmap roadmap={report.learningRoadmap} />
            </TabsContent>
            <TabsContent value="certs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.recommendedCertifications.map((cert, i) => (
                  <div key={i} className="glass p-4 rounded-xl flex items-start gap-3">
                    <Award className="w-6 h-6 text-secondary shrink-0" />
                    <div>
                      <div className="font-bold text-secondary">{cert}</div>
                      <div className="text-xs text-muted-foreground">Globally recognized standard in the industry.</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="future">
              <div className="space-y-4">
                {report.futureOpportunities.map((opp, i) => (
                  <div key={i} className="glass p-4 rounded-xl flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-primary/50" />
                    <p className="text-sm italic text-muted-foreground">"{opp}"</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <SkillGapAnalysis analysis={report.skillGapAnalysis} />

          <div className="glass p-6 rounded-2xl border-white/10">
            <h4 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Resume Optimization
            </h4>
            <ul className="space-y-3">
              {report.resumeTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground border-b border-white/5 pb-2 last:border-0">
                  <span className="text-primary font-bold">#</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
