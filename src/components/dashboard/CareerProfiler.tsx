"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Send, BrainCircuit, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { processVoiceInputForProfile } from "@/ai/flows/process-voice-input-for-profile";
import { generateCareerReport, GenerateCareerReportInput } from "@/ai/flows/generate-career-report";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CareerProfilerProps {
  onReportGenerated: (report: any) => void;
}

export function CareerProfiler({ onReportGenerated }: CareerProfilerProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    educationBackground: "",
    skills: "",
    interests: "",
    careerGoal: ""
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const { transcribedText } = await processVoiceInputForProfile({ audioDataUri: base64Audio });
            setFormData(prev => ({ ...prev, skills: prev.skills + (prev.skills ? ", " : "") + transcribedText }));
            toast({ title: "Transcription successful", description: "Added to skills profile." });
          } catch (error) {
            toast({ variant: "destructive", title: "Transcription failed", description: "Could not process audio." });
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Recording started", description: "Speak now to describe your skills." });
    } catch (err) {
      toast({ variant: "destructive", title: "Microphone access denied" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.educationBackground) {
      toast({ variant: "destructive", title: "Missing information", description: "Full name and education are required." });
      return;
    }

    setIsAnalyzing(true);
    try {
      const input: GenerateCareerReportInput = {
        fullName: formData.fullName,
        educationBackground: formData.educationBackground,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        careerGoal: formData.careerGoal
      };

      const report = await generateCareerReport(input);
      onReportGenerated({ ...report, input });
      toast({ title: "Analysis complete", description: "Your personalized roadmap is ready." });
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis failed", description: "AI engine encountered an error." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="glass border-primary/20 neon-border overflow-hidden shadow-2xl">
      <CardHeader className="bg-primary/5 pb-6">
        <CardTitle className="font-headline text-3xl flex items-center gap-4">
          <div className="p-2 bg-primary/20 rounded-xl">
            <BrainCircuit className="text-primary w-8 h-8" />
          </div>
          AI Career Advisor
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 text-base">Describe your professional background to generate a 6-month growth plan.</CardDescription>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-bold uppercase tracking-wider opacity-70">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g. Alex Johnson"
                className="bg-background/50 border-white/10 rounded-xl h-12 focus:ring-primary/50"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-bold uppercase tracking-wider opacity-70">Education Background</Label>
              <Input
                id="education"
                placeholder="e.g. B.S. in Computer Science"
                className="bg-background/50 border-white/10 rounded-xl h-12 focus:ring-primary/50"
                value={formData.educationBackground}
                onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="skills" className="text-sm font-bold uppercase tracking-wider opacity-70">Skills & Tech Stack</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="glass border-white/10">
                    <p className="text-xs">Comma separated values. You can also use voice input.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Textarea
                id="skills"
                placeholder="React, Python, Project Management, Data Science..."
                className="bg-background/50 border-white/10 min-h-[120px] rounded-2xl pr-14 pt-4 leading-relaxed focus:ring-primary/50"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-3 bottom-3 w-10 h-10 rounded-xl transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-primary/10 text-muted-foreground'}`}
                onClick={isRecording ? stopRecording : startRecording}
                title={isRecording ? "Stop Recording" : "Use Voice Input"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="text-sm font-bold uppercase tracking-wider opacity-70">Interests & Specializations</Label>
            <Input
              id="interests"
              placeholder="e.g. AI Ethics, Cloud Infrastructure, Product Design"
              className="bg-background/50 border-white/10 rounded-xl h-12 focus:ring-primary/50"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerGoal" className="text-sm font-bold uppercase tracking-wider opacity-70">Long-term Aspirations</Label>
            <Input
              id="careerGoal"
              placeholder="e.g. Chief Technology Officer, Lead Data Scientist"
              className="bg-background/50 border-white/10 rounded-xl h-12 focus:ring-primary/50"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-7 text-xl rounded-2xl shadow-2xl shadow-primary/20 group transition-all"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : (
              <Send className="mr-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
            {isAnalyzing ? "Processing AI Analysis..." : "Generate AI Career Roadmap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
