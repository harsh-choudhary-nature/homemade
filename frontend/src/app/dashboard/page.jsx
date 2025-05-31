"use client";

import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation"; // use next/navigation for app router
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // Optionally show a spinner
  }


  return (
    <div>
      Welcome to the Dashboard! <Link href="/dashboard/profile">{user.username}</Link>
    </div>
  );
}
