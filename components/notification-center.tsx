"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, BellRing, Check, X, Clock, DollarSign, Calendar, Trash2, Settings } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns"
import { pt, fr, enUS } from "date-fns/locale"
import { notificationManager } from "@/lib/notifications"

export interface Notification {
  id: string
  type: "booking" | "commission" | "payment" | "system" | "urgent"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  data?: any
  priority: "low" | "medium" | "high" | "urgent"
}

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { t, language } = useLanguage()
  const { user } = useAuth()

  // Initialize notifications based on user type
  useEffect(() => {
    const getInitialNotifications = (): Notification[] => {
      if (user?.userType === "client") {
        return [
          {
            id: "1",
            type: "booking",
            title: "Booking Confirmed",
            message: "Your appointment with Maria Santos is confirmed for today at 4:00 PM",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false,
            actionUrl: "/client/dashboard",
            priority: "high",
          },
          {
            id: "2",
            type: "booking",
            title: "Barber Available",
            message: "Carlos Silva is now available near your location",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
            priority: "medium",
          },
          {
            id: "3",
            type: "system",
            title: "Profile Updated",
            message: "Your profile information has been successfully updated",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            priority: "low",
          },
        ]
      } else if (user?.userType === "professional") {
        return [
          {
            id: "1",
            type: "booking",
            title: "New Booking Request",
            message: "John Smith requested a haircut for tomorrow at 2:00 PM",
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            read: false,
            actionUrl: "/professional/dashboard",
            priority: "high",
          },
          {
            id: "2",
            type: "commission",
            title: "Commission Payment Due",
            message: "You have a pending commission payment of $5.25",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false,
            actionUrl: "/professional/dashboard",
            priority: "medium",
          },
          {
            id: "3",
            type: "payment",
            title: "Payment Approved",
            message: "Your commission payment of $7.50 has been approved",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
            priority: "medium",
          },
        ]
      } else {
        return [
          {
            id: "1",
            type: "system",
            title: "Platform Update",
            message: "New features have been added to the admin dashboard",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            read: false,
            priority: "medium",
          },
        ]
      }
    }

    setNotifications(getInitialNotifications())

    // Register callback with notification manager
    const handleNewNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev])
    }

    notificationManager.addNotificationCallback(handleNewNotification)

    // Cleanup
    return () => {
      notificationManager.removeNotificationCallback(handleNewNotification)
    }
  }, [user?.userType])

  // Simulate real-time notifications based on user type
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        // 10% chance every 30 seconds
        let newNotification: Notification

        if (user?.userType === "client") {
          newNotification = {
            id: Date.now().toString(),
            type: Math.random() > 0.5 ? "booking" : "system",
            title: Math.random() > 0.5 ? "Barber Available" : "Location Update",
            message:
              Math.random() > 0.5
                ? "A barber is now available near your location"
                : "Your location has been updated successfully",
            timestamp: new Date(),
            read: false,
            priority: "medium",
          }
        } else if (user?.userType === "professional") {
          newNotification = {
            id: Date.now().toString(),
            type: Math.random() > 0.5 ? "booking" : "commission",
            title: Math.random() > 0.5 ? "New Booking Request" : "Commission Payment",
            message:
              Math.random() > 0.5 ? "New client requested your services" : "Commission payment is ready for processing",
            timestamp: new Date(),
            read: false,
            priority: "high",
          }
        } else {
          newNotification = {
            id: Date.now().toString(),
            type: "system",
            title: "Admin Alert",
            message: "New activity requires your attention",
            timestamp: new Date(),
            read: false,
            priority: "medium",
          }
        }

        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [user?.userType])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getDateLocale = () => {
    switch (language) {
      case "pt":
        return pt
      case "fr":
        return fr
      default:
        return enUS
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: getDateLocale(),
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4 text-blue-600" />
      case "commission":
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-600" />
      case "urgent":
        return <BellRing className="w-4 h-4 text-red-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50"
      case "high":
        return "border-l-orange-500 bg-orange-50"
      case "medium":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-300 bg-gray-50"
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${className}`}>
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>

              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications</h3>
                  <p className="text-xs text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                        !notification.read ? getPriorityColor(notification.priority) : "border-l-gray-200 bg-white"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`text-sm font-medium truncate ${
                                !notification.read ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h4>

                            <div className="flex items-center space-x-2 ml-2">
                              {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <p className={`text-sm mb-2 ${!notification.read ? "text-gray-800" : "text-gray-600"}`}>
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </span>

                            {notification.priority === "urgent" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>

          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to full notifications page if you have one
                  }}
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Notification Settings
                </Button>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  )
}
