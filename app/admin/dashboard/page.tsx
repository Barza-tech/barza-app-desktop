"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminDashboardPage() {
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

      if (user.userType !== "admin") {
        // Redirect to correct dashboard based on user type
        if (user.userType === "client") {
          router.replace("/client/dashboard")
        } else if (user.userType === "professional") {
          router.replace("/professional/dashboard")
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

  if (loading || !user || user.userType !== "admin" || !user.isVerified) {
    return <LoadingSpinner />
  }

  return <AdminDashboard />
}
