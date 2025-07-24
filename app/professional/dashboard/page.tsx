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
    if (!user) {
      router.push("/")
      return
    }

    if (user.userType !== "professional") {
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

  return <ProfessionalDashboard />
}
