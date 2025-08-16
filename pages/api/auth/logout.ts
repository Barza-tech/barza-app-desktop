import type { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1, // expira imediatamente
      path: "/",
      sameSite: "lax",
    })
  )

  return res.status(200).json({ message: "Logged out" })
}
