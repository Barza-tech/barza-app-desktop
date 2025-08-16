// pages/api/auth/me.ts
// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { parse } from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
    const token = cookies["access_token"] // só o valor do access_token

    console.log("req.headers.cookie:", req.headers.cookie)
    console.log("Token from cookies:", token)

    if (!token) {
      return res.status(401).json({ error: "No token found" })
    }

    const userRes = await fetch("https://vuqlvieuqimcaywcxteg.supabase.co/auth/v1/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    })

    console.log("User response status:", userRes.status)

    if (!userRes.ok) {
      return res.status(401).json({ error: "Invalid token" })
    }

    const user = await userRes.json()
    return res.status(200).json(user)
  } catch (err) {
    console.error("API /me error:", err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
