"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Search, MapPin, Star, Scissors, LogOut, User, Map, List, Filter, Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { BookingModal } from "@/components/booking-modal"
import { StaticMap } from "@/components/static-map"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationSetup } from "@/components/notification-setup"
import { NotificationCenter } from "@/components/notification-center"
import { ClientProfile } from "@/components/client-profile"
import { reverseGeocode, type LocationInfo } from "@/lib/geocoding"

interface Professional {
  id: string
  name: string
  rating: number
  distance: string
  services: string[]
  price: number
  isAvailable: boolean
  location: { lat: number; lng: number }
  completedServices: number
}

const mockProfessionals: Professional[] = [
  { id: "1", name: "Maria Santos", rating: 4.8, distance: "0.5 km", services: ["Haircut", "Beard Trim", "Styling"], price: 35, isAvailable: true, location: { lat: 38.7223, lng: -9.1393 }, completedServices: 127 },
  { id: "2", name: "Carlos Silva", rating: 4.6, distance: "1.2 km", services: ["Haircut", "Shave"], price: 25, isAvailable: true, location: { lat: 38.7253, lng: -9.1423 }, completedServices: 89 },
  { id: "3", name: "Ana Costa", rating: 4.9, distance: "0.8 km", services: ["Hair Styling", "Color", "Treatment"], price: 40, isAvailable: false, location: { lat: 38.7193, lng: -9.1363 }, completedServices: 156 },
  { id: "4", name: "João Pereira", rating: 4.7, distance: "1.5 km", services: ["Haircut", "Beard Care", "Full Service"], price: 45, isAvailable: true, location: { lat: 38.7283, lng: -9.1453 }, completedServices: 203 },
]

export function ClientDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userLocationInfo, setUserLocationInfo] = useState<LocationInfo | null>(null)
  const [filteredProfessionals, setFilteredProfessionals] = useState(mockProfessionals)

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude }
          setUserLocation(location)
          try {
            const locationInfo = await reverseGeocode(location.lat, location.lng)
            setUserLocationInfo(locationInfo)
          } catch (error) {
            console.error("Error getting location info:", error)
          }
        },
        () => {
          const defaultLocation = { lat: 38.7223, lng: -9.1393 }
          setUserLocation(defaultLocation)
        }
      )
    }
  }, [])

  // Filter professionals
  useEffect(() => {
    const filtered = mockProfessionals.filter(
      (prof) =>
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredProfessionals(filtered)
  }, [searchQuery])

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional)
    setShowBookingModal(true)
  }

  const handleLocationUpdate = async (location: { lat: number; lng: number }) => {
    setUserLocation(location)
    try {
      const locationInfo = await reverseGeocode(location.lat, location.lng)
      setUserLocationInfo(locationInfo)
    } catch (error) {
      console.error("Error getting location info:", error)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "👋 " + t.logout,
      description: "You have been logged out successfully",
    })
  }

  const center = userLocation || { lat: 38.7223, lng: -9.1393 }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 barza-gradient rounded-lg flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Barza</h1>
                <p className="text-xs text-gray-500">{t.findPerfectBarber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2">
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-800 text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowProfile(true)
                    setShowMobileMenu(false)
                  }}
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t.profile}
                </Button>

                <LanguageSwitcher />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.logout}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white shadow-sm border-b hidden lg:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 barza-gradient rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barza</h1>
                <p className="text-sm text-gray-500">{t.findPerfectBarber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <LanguageSwitcher />
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.name || "User"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 lg:py-6">
        <NotificationSetup />

        {/* Search and Filters */}
        <div className="mb-4 lg:mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t.searchServices}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="flex-1 sm:flex-none"
              >
                <Map className="w-4 h-4 mr-2" />
                {t.mapView}
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1 sm:flex-none"
              >
                <List className="w-4 h-4 mr-2" />
                {t.listView}
              </Button>
            </div>

            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              {t.filter}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")}>
          <TabsContent value="map" className="mt-0">
            <div className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border">
              <StaticMap
                center={center}
                professionals={filteredProfessionals}
                userLocation={userLocation}
                onProfessionalSelect={handleProfessionalSelect}
                onLocationUpdate={handleLocationUpdate}
                userLocationInfo={userLocationInfo}
              />
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredProfessionals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noProfsFound}</h3>
                    <p className="text-gray-600">{t.adjustSearch}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfessionals.map((professional) => (
                    <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-orange-100 text-orange-800">
                                {professional.name?.charAt(0) || "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sm">{professional.name}</h3>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span>{professional.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{professional.distance}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={`px-2 py-1 text-xs ${professional.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                            {professional.isAvailable ? t.available : t.unavailable}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {professional.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>${professional.price}</span>
                          <Button size="sm" onClick={() => handleProfessionalSelect(professional)}>
                            {t.book}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showBookingModal && selectedProfessional && (
        <BookingModal
          professional={selectedProfessional}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {showProfile && <ClientProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />}
    </div>
  )
}

