"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, BellOff, X } from "lucide-react"
import { useLanguage } from "./language-provider"

export function NotificationSetup() {
  const [showSetup, setShowSetup] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const { t } = useLanguage()

  useEffect(() => {
    // Check if notifications are supported
    if ("Notification" in window) {
      setPermission(Notification.permission)

      // Show setup if permission is default (not asked yet)
      if (Notification.permission === "default") {
        // Show after a delay to not overwhelm user
        const timer = setTimeout(() => {
          setShowSetup(true)
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setPermission(permission)

        if (permission === "granted") {
          // Show a test notification
          new Notification("🎉 Notifications Enabled!", {
            body: "You'll now receive booking updates and important alerts",
            icon: "/favicon.ico",
            tag: "welcome",
          })
        }

        setShowSetup(false)
      } catch (error) {
        console.error("Error requesting notification permission:", error)
      }
    }
  }

  const dismissSetup = () => {
    setShowSetup(false)
    // Don't show again for this session
    sessionStorage.setItem("notification-setup-dismissed", "true")
  }

  // Don't show if already dismissed this session
  if (sessionStorage.getItem("notification-setup-dismissed")) {
    return null
  }

  // Don't show if notifications not supported or already granted/denied
  if (!("Notification" in window) || permission !== "default" || !showSetup) {
    return null
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-orange-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-orange-900 mb-1">Enable Notifications</h3>
            <p className="text-sm text-orange-800 mb-3">
              Get instant updates about booking confirmations, barber availability, and important alerts.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={requestPermission} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>

              <Button
                onClick={dismissSetup}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
              >
                <BellOff className="w-4 h-4 mr-2" />
                Maybe Later
              </Button>
            </div>
          </div>

          <Button
            onClick={dismissSetup}
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
