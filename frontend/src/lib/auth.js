import { cookies } from "next/headers";
import delay from "@/lib/delay";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function getUserFromRequest() {
  // await delay(5000);
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);

    return { ...decoded };
  } catch (err) {
    return null;
  }
}
