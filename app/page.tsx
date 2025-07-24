"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthPage } from "@/components/auth-page"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait a moment for auth state to load
    const timer = setTimeout(() => {
      if (user && user.isVerified) {
        // Redirect to appropriate dashboard based on user type
        if (user.userType === "client") {
          router.replace("/client/dashboard")
        } else if (user.userType === "professional") {
          router.replace("/professional/dashboard")
        } else if (user.userType === "admin") {
          router.replace("/admin/dashboard")
        }
      } else {
        setLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  if (loading) {
    return <LoadingSpinner />
  }

  // If no user, show auth page directly
  return <AuthPage />
}
