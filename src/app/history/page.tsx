
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Calendar, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore";

export default function HistoryPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const reportsRef = user ? collection(db, 'users', user.uid, 'reports') : null;
  const reportsQuery = reportsRef ? query(reportsRef, orderBy('timestamp', 'desc')) : null;
  const { data: reports, loading: dataLoading } = useCollection(reportsQuery);

  const handleDelete = async (reportId: string) => {
    if (!user) return;
    const reportRef = doc(db, 'users', user.uid, 'reports', reportId);
    await deleteDoc(reportRef);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Report Vault</h1>
            <p className="text-muted-foreground">Access your cloud-synced career pathways.</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary px-4 py-1">
            {reports?.length || 0} Reports Saved
          </Badge>
        </div>

        {(!reports || reports.length === 0) ? (
          <div className="glass p-12 rounded-3xl text-center space-y-6">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No reports found</h3>
              <p className="text-muted-foreground">Start by analyzing your career profile in the dashboard.</p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/80">Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((item: any) => (
              <Card key={item.id} className="glass border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl truncate">{item.input.fullName}</CardTitle>
                    <div className="text-xs font-bold text-primary">{item.output.careerMatchPercentage}% Match</div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {format(item.timestamp, 'MMM dd, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Top Suggestion</div>
                    <div className="text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {item.output.careerSuggestions[0]}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="secondary" className="flex-1 text-xs" asChild>
                      <Link href="/dashboard">
                        <ExternalLink className="w-3 h-3 mr-2" /> View
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
