
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Chrome } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full glass border-primary/20 neon-border animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-4 rounded-2xl">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-lg">
            Sign in to StudyGie AI to access your personalized career roadmaps and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <Button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black hover:bg-white/90 py-8 text-lg font-bold rounded-2xl flex items-center justify-center gap-4 transition-transform hover:scale-[1.02]"
          >
            <Chrome className="w-6 h-6" />
            Continue with Google
          </Button>
          <p className="mt-8 text-center text-xs text-muted-foreground uppercase tracking-widest">
            Secure enterprise-grade authentication
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
