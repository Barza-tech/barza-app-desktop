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
    if (!user) {
      router.push("/")
      return
    }

    if (user.userType !== "admin") {
      router.push("/")
      return
    }

    setLoading(false)
  }, [user, router])

  if (loading) {
    return <LoadingSpinner />
  }

  return <AdminDashboard />
}
