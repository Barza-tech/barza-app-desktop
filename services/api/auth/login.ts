// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) return res.status(400).json({ error: data.error_description || "Login failed" });

    // Coloca token em cookie HTTP-only
    res.setHeader(
      "Set-Cookie",
      `barza_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${data.expires_in}`
    );

    // Retorna apenas o usuário (token já está seguro no cookie)
    res.status(200).json({ user: data.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

