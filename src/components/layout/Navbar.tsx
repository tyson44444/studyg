
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, History, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

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
        </div>
      </div>
    </nav>
  );
}
