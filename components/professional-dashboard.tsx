"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Bell,
  LogOut,
  Scissors,
  CheckCircle,
  XCircle,
  Upload,
  CreditCard,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { CommissionPaymentModal } from "@/components/commission-payment-modal"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationSetup } from "@/components/notification-setup"
import { NotificationCenter } from "@/components/notification-center"
import { notificationManager } from "@/lib/notifications"

interface BookingRequest {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  price: number
  status: "pending" | "accepted" | "completed"
  commission: number
}

const mockBookings: BookingRequest[] = [
  {
    id: "1",
    clientName: "John Smith",
    service: "Haircut + Beard Trim",
    date: "2024-01-25",
    time: "14:00",
    price: 35,
    status: "pending",
    commission: 5.25,
  },
  {
    id: "2",
    clientName: "Mike Johnson",
    service: "Haircut",
    date: "2024-01-24",
    time: "16:30",
    price: 25,
    status: "completed",
    commission: 3.75,
  },
  {
    id: "3",
    clientName: "David Wilson",
    service: "Full Service",
    date: "2024-01-23",
    time: "10:00",
    price: 50,
    status: "completed",
    commission: 7.5,
  },
]

export function ProfessionalDashboard() {
  const { user, logout, toggleAvailability } = useAuth()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const [bookings, setBookings] = useState(mockBookings)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [selectedCommission, setSelectedCommission] = useState<BookingRequest | null>(null)

  useEffect(() => {
    notificationManager.setLanguage(language)
  }, [language])

  const handleAcceptBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "accepted" as const } : booking)),
    )
    toast({
      title: t.bookingAccepted,
      description: t.clientNotified,
    })
    if (booking) {
      notificationManager.notifyBookingAccepted(user?.name || "Professional", booking.service, booking.time)
    }
  }

  const handleRejectBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))
    toast({
      title: t.bookingRejected,
      description: t.clientNotified,
    })
  }

  const handleCompleteService = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "completed" as const } : booking)),
    )
    toast({
      title: t.serviceCompleted,
      description: t.commissionAdded,
    })
  }

  const handlePayCommission = (booking: BookingRequest) => {
    setSelectedCommission(booking)
    setShowCommissionModal(true)
  }

  const handleAvailabilityToggle = () => {
    toggleAvailability()
    toast({
      title: user?.professionalInfo?.isAvailable ? t.nowOffline : t.nowAvailable,
      description: user?.professionalInfo?.isAvailable ? t.clientsCantSee : t.clientsCanFind,
    })
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.price, 0)
  const totalCommissions = completedBookings.reduce((sum, b) => sum + b.commission, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Branding */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 barza-gradient rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Barza Pro</h1>
                <p className="text-xs sm:text-sm text-gray-500">{t.professionalDashboard}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-wrap items-center gap-3">
              <NotificationCenter />
              <LanguageSwitcher />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t.available}</span>
                <Switch
                  checked={user?.professionalInfo?.isAvailable || false}
                  onCheckedChange={handleAvailabilityToggle}
                />
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {user?.name.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-[160px]">
                  {user?.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <NotificationSetup />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Earnings */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{t.totalEarnings}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">${totalEarnings}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Commissions */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{t.pendingCommissions}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">${totalCommissions}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Services */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{t.completedServices}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user?.professionalInfo?.completedServices || 0}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{t.rating}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{user?.professionalInfo?.rating || 0}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="bookings" className="flex-1 sm:flex-none">{t.bookingRequests}</TabsTrigger>
            <TabsTrigger value="commissions" className="flex-1 sm:flex-none">{t.commissionPayments}</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none">{t.serviceHistory}</TabsTrigger>
          </TabsList>

          {/* Bookings */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {t.pendingRequests} ({pendingBookings.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-8 px-2">
                    <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{t.noPendingRequests}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{t.newBookingRequests}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base">{booking.clientName}</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{booking.service}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>${booking.price}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button size="sm" variant="outline" className="flex-1 sm:flex-none"
                              onClick={() => handleRejectBooking(booking.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              {t.reject}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {t.accept}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions */}
          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t.commissionPayments}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1 text-sm sm:text-base">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{booking.clientName}</h4>
                            <Badge variant="outline">{booking.service}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                            <span>{booking.date}</span>
                            <span>Service: ${booking.price}</span>
                            <span className="text-orange-600 font-medium">Commission: ${booking.commission}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePayCommission(booking)}
                          className="barza-gradient text-white w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Pay Commission
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">{t.serviceHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings
                    .filter((b) => b.status === "completed")
                    .map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                              <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">{booking.clientName}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">{booking.service}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                <span>{booking.date}</span>
                                <span>•</span>
                                <span>{booking.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm sm:text-base">${booking.price}</p>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CommissionPaymentModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        booking={selectedCommission}
      />
    </div>
  )
}
