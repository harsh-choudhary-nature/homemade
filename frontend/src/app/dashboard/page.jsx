// app/dashboard/page.jsx or .tsx (server component by default)
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromRequest } from "@/lib/auth"; // You need to implement this helper

export default async function Dashboard() {
  // On the server, get user from cookie/session/token
  const user = await getUserFromRequest();

  if (!user) {
    // Redirect to login if user is not authenticated
    redirect("/login");
  }

  return (
    <div>
      Welcome to the Dashboard!{" "}
      <Link href="/dashboard/profile">{user.username}</Link>
    </div>
  );
}
