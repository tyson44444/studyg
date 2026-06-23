
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect away from login page since auth is removed
    router.replace("/dashboard");
  }, [router]);

  return null;
}
