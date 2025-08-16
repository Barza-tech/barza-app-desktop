import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, name, phone, userType } = req.body;
  const supabase = createClient(req as any);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, userType },
      emailRedirectTo: "https://app.barrza.com/client/dashboard",
    },
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ user: data.user });
}
