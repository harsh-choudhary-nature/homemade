// app/dashboard/profile/page.tsx or page.jsx
import { redirect } from "next/navigation";
import { getUserFromRequest } from "@/lib/auth"; // <- You must implement this

export default async function Profile() {
  const user = await getUserFromRequest();

  if (!user) {
    redirect("/login");
  }

  return <div>Welcome to the Profile! {user.username}</div>;
}
