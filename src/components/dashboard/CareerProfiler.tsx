
"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Send, BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { processVoiceInputForProfile } from "@/ai/flows/process-voice-input-for-profile";
import { generateCareerReport, GenerateCareerReportInput } from "@/ai/flows/generate-career-report";
import { useToast } from "@/hooks/use-toast";

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
            toast({ title: "Transcription successful", description: "Added to skills/interests context." });
          } catch (error) {
            toast({ variant: "destructive", title: "Transcription failed" });
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
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
      toast({ variant: "destructive", title: "Missing information", description: "Please fill in all basic fields." });
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
      toast({ title: "Analysis complete", description: "Your personalized career roadmap is ready." });
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis failed", description: "Please try again later." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="glass border-primary/20 neon-border overflow-hidden">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <BrainCircuit className="text-primary w-8 h-8" />
          Career Counselor AI
        </CardTitle>
        <CardDescription>Tell us about your background and aspirations to unlock your potential.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                className="bg-background/50 border-white/10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Background</Label>
              <Input
                id="education"
                placeholder="B.S. in Computer Science"
                className="bg-background/50 border-white/10"
                value={formData.educationBackground}
                onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="skills">Technical Skills (Comma separated)</Label>
            <div className="relative">
              <Textarea
                id="skills"
                placeholder="React, Python, AWS, Data Analysis..."
                className="bg-background/50 border-white/10 min-h-[100px] pr-12"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests & Passions</Label>
            <Input
              id="interests"
              placeholder="AI Ethics, Web3, Space Exploration..."
              className="bg-background/50 border-white/10"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerGoal">Long-term Career Goal</Label>
            <Input
              id="careerGoal"
              placeholder="CTO of a Tech Startup"
              className="bg-background/50 border-white/10"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-primary/20 group"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
            {isAnalyzing ? "Processing Intelligence..." : "Generate AI Career Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
