
"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, Info } from "lucide-react";

interface SkillGapAnalysisProps {
  analysis: {
    currentSkills: string[];
    missingSkills: string[];
    improvementSuggestions: string[];
  };
}

export function SkillGapAnalysis({ analysis }: SkillGapAnalysisProps) {
  return (
    <Card className="glass border-white/10 h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          Skill Gap Analysis
          <Info className="w-4 h-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Your Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.currentSkills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Critical Gaps</h4>
          <div className="space-y-3">
            {analysis.missingSkills.map((skill, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="text-destructive font-medium">Acquire Required</span>
                </div>
                <Progress value={20 + (i * 10)} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-secondary" />
            AI Recommendations
          </h4>
          <ul className="text-xs text-muted-foreground space-y-2">
            {analysis.improvementSuggestions.map((suggestion, i) => (
              <li key={i} className="list-disc ml-4">{suggestion}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
