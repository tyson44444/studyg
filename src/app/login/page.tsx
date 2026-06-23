
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network delay for the demo
    setTimeout(() => {
      localStorage.setItem("studygie_demo_user", JSON.stringify({
        email: email || "demo@example.com",
        name: email.split('@')[0] || "Demo User"
      }));
      
      toast({
        title: "Demo Login Successful",
        description: "Welcome to StudyGie AI!",
      });
      
      router.push("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md glass border-primary/20 neon-border animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/20 p-3 rounded-2xl w-fit mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your details to access your career vault.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDemoLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 bg-background/50 border-white/10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-background/50 border-white/10"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80 text-white py-6 rounded-xl group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Experience</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full glass border-white/10"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              Sign in as Guest
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
