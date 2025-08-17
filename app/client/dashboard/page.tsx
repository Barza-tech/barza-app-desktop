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
    if (!user) return
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (loading) return
    if (!user) router.replace("/")
  }, [loading, user, router])

  if (loading || !user) return <LoadingSpinner />

  return <ClientDashboard />
}

