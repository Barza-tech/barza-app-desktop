import type { NextApiRequest, NextApiResponse } from "next";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, name, phone, userType } = req.body;

  try {
    const redirectUrl =  "https://app.barrza.com/";

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        options: {
          data: { name, phone, userType },
          emailRedirectTo:redirectUrl ,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(400).json({ error: data.error?.message || "Registration failed" });
    }

    res.status(200).json({ user: data.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

