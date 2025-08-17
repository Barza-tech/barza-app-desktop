import type { NextApiRequest, NextApiResponse } from "next";
import {serialize} from "cookie";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });


  const { email, password } = req.body;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      }
    );


    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ error: data.error_description || "Login failed" });
    }
    res.setHeader(
      "Set-Cookie",
      serialize("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: data.expires_in,
      })
    );

    const user = data.user; 

    return res.status(200).json({ message: "Logged in", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


