"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // Or a loading spinner if you want
  }

  return <div>Welcome to the Dashboard! {user.email}</div>;
};

export default Dashboard;
