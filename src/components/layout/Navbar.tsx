
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, History, LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [demoUser, setDemoUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("studygie_demo_user");
    if (stored) {
      setDemoUser(JSON.parse(stored));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("studygie_demo_user");
    setDemoUser(null);
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
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link href="/history" className={`text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/history' ? 'text-primary' : 'hover:text-primary'}`}>
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

          {demoUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{demoUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{demoUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history" className="cursor-pointer">
                    <History className="w-4 h-4 mr-2" /> My Vault
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 text-primary">
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
