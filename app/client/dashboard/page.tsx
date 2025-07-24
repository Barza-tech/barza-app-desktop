"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ClientDashboard } from "@/components/client-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ClientDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.userType !== "client") {
      router.push("/")
      return
    }

    if (!user.isVerified) {
      router.push("/")
      return
    }

    setLoading(false)
  }, [user, router])

  if (loading) {
    return <LoadingSpinner />
  }

  return <ClientDashboard />
}
