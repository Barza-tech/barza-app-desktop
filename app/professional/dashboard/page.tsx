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
    if (!user) return
    setLoading(false)
  }, [user])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return <ProfessionalDashboard />
}
