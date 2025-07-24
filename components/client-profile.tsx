"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "./auth-provider"
import { useLanguage } from "./language-provider"
import { useToast } from "@/hooks/use-toast"
import { User, Camera, Edit3, Bell, Globe, Palette, Calendar, Star } from "lucide-react"

interface ClientProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function ClientProfile({ isOpen, onClose }: ClientProfileProps) {
  const { user, updateProfile } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications || true,
    language: user?.preferences?.language || "pt",
    theme: user?.preferences?.theme || "light",
  })

  const handleSaveProfile = () => {
    if (!user) return

    updateProfile({
      ...formData,
      preferences: preferences,
    })

    // Update language if changed
    if (preferences.language !== language) {
      setLanguage(preferences.language as "en" | "pt" | "fr")
    }

    setIsEditing(false)
    toast({
      title: "✅ " + t.save,
      description: "Your profile has been successfully updated.",
    })
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setPreferences({
      notifications: user?.preferences?.notifications || true,
      language: user?.preferences?.language || "pt",
      theme: user?.preferences?.theme || "light",
    })
    setIsEditing(false)
  }

  if (!user) return null

  const mockBookings = [
    {
      id: "1",
      barberName: "Maria Santos",
      service: "Haircut + Beard Trim",
      date: "2024-01-20",
      time: "14:00",
      price: 35,
      status: "completed",
      rating: 5,
    },
    {
      id: "2",
      barberName: "Carlos Silva",
      service: "Haircut",
      date: "2024-01-15",
      time: "16:30",
      price: 25,
      status: "completed",
      rating: 4,
    },
    {
      id: "3",
      barberName: "Ana Costa",
      service: "Hair Styling",
      date: "2024-01-10",
      time: "10:00",
      price: 40,
      status: "completed",
      rating: 5,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-4">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <User className="w-5 h-5" />
            <span>{t.profile}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              {t.profile}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs sm:text-sm">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              {t.settings}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-orange-100 text-orange-800 text-xl sm:text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            {t.client}
                          </Badge>
                          {user.isVerified && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? t.cancel : t.edit}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.profile} Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.fullName}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">{t.phoneNumber}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                      {t.cancel}
                    </Button>
                    <Button onClick={handleSaveProfile} className="flex-1 barza-gradient text-white">
                      {t.save}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{user.clientInfo?.totalBookings || 0}</div>
                  <div className="text-xs text-gray-600">{t.totalBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{mockBookings.length}</div>
                  <div className="text-xs text-gray-600">{t.completed}</div>
                </CardContent>
              </Card>
              <Card className="col-span-2 sm:col-span-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(mockBookings.reduce((sum, b) => sum + b.rating, 0) / mockBookings.length || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Avg {t.rating}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-sm sm:text-base">{booking.barberName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {booking.service}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>${booking.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < booking.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">{t.completed}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm sm:text-base">Push Notifications</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Receive booking updates and offers</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Globe className="w-5 h-5" />
                  <span>{t.language}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="pt">🇵🇹 Português</SelectItem>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Palette className="w-5 h-5" />
                  <span>Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Light</SelectItem>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                    <SelectItem value="auto">🔄 Auto</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                {t.cancel}
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1 barza-gradient text-white">
                {t.save} {t.settings}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
