import delay from "@/lib/delay";
import { cookies } from "next/headers";

export async function getUserFromRequest() {
  // await delay(5000);
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/dashboard/user/me`,
      {
        headers: {
          // Forward cookie header manually
          cookie: refreshToken ? `refreshToken=${refreshToken}` : "",
        },
        method: "GET",
        credentials: "include", // Send cookies
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.log("Auth error:", data.message);
      return null;
    }
    console.log("data:", data);
    console.log("Authenticated user:", data.user);
    return data.user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
