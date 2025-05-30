import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    // Fetch user info from DB if needed using decoded.userId or decoded.email
    // Or just return decoded token info as user data
    // console.log("User authenticated:", decoded);
    return {
      username: decoded.username,
      email: decoded.email,
      userId: decoded.userId,
    };
  } catch (err) {
    return null;
  }
}
