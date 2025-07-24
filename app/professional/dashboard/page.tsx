"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ProfessionalDashboard } from "@/components/professional-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProfessionalDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait a moment for auth state to load
    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/")
        return
      }

      if (user.userType !== "professional") {
        // Redirect to correct dashboard based on user type
        if (user.userType === "client") {
          router.replace("/client/dashboard")
        } else if (user.userType === "admin") {
          router.replace("/admin/dashboard")
        } else {
          router.replace("/")
        }
        return
      }

      if (!user.isVerified) {
        router.replace("/")
        return
      }

      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  if (loading || !user || user.userType !== "professional" || !user.isVerified) {
    return <LoadingSpinner />
  }

  return <ProfessionalDashboard />
}
