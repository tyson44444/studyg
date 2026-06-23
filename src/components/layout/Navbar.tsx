
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, History, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">StudyGie <span className="text-primary">AI</span></span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className={`text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/dashboard' ? 'text-primary' : 'hover:text-primary'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/history" className={`text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/history' ? 'text-primary' : 'hover:text-primary'}`}>
            <History className="w-4 h-4" />
            History
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Avatar className="w-8 h-8 border border-primary/30">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive p-0"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-primary text-white hover:bg-primary/80 rounded-xl px-6">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
