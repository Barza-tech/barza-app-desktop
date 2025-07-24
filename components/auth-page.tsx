"use client"

import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"

export function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <AuthModal
        isOpen={true}
        onClose={() => {}} // No close action since this is the main page
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
