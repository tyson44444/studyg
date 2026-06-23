
"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LearningRoadmapProps {
  roadmap: Array<{ month: string; activities: string[] }>;
}

export function LearningRoadmap({ roadmap }: LearningRoadmapProps) {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="font-headline text-xl">6-Month Transformation Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-secondary before:to-transparent">
          {roadmap.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shadow shadow-primary/50 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all group-hover:scale-110">
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-primary">{step.month}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    {step.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
