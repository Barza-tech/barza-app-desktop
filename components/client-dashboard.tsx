"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Search, Star, User, Calendar, Scissors, LogOut, Filter } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { GoogleMap } from "@/components/google-map"
import { BookingModal } from "@/components/booking-modal"
import { useToast } from "@/hooks/use-toast"

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
  profileImage?: string
}

const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Carlos Silva",
    rating: 4.8,
    distance: "0.5 km",
    services: ["Haircut", "Beard Trim", "Styling"],
    price: 25,
    isAvailable: true,
    location: { lat: 40.7128, lng: -74.006 },
    completedServices: 156,
  },
  {
    id: "2",
    name: "Maria Santos",
    rating: 4.9,
    distance: "1.2 km",
    services: ["Hair Styling", "Color", "Treatment"],
    price: 45,
    isAvailable: true,
    location: { lat: 40.7589, lng: -73.9851 },
    completedServices: 203,
  },
  {
    id: "3",
    name: "João Oliveira",
    rating: 4.7,
    distance: "2.1 km",
    services: ["Haircut", "Shave", "Beard Care"],
    price: 30,
    isAvailable: false,
    location: { lat: 40.7282, lng: -73.7949 },
    completedServices: 89,
  },
]

export function ClientDashboard() {
  const { user, logout, updateLocation } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [mapView, setMapView] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          updateLocation(location)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location access denied",
            description: "Please enable location access to find nearby professionals",
            variant: "destructive",
          })
        },
      )
    }
  }, [updateLocation, toast])

  const filteredProfessionals = mockProfessionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleBookService = (professional: Professional) => {
    setSelectedProfessional(professional)
    setShowBookingModal(true)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 barza-gradient rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barza</h1>
                <p className="text-sm text-gray-500">Find your perfect barber</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for services or professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant={mapView ? "default" : "outline"} size="sm" onClick={() => setMapView(!mapView)}>
                <MapPin className="w-4 h-4 mr-2" />
                {mapView ? "List" : "Map"}
              </Button>
            </div>
          </div>
        </div>

        {mapView ? (
          /* Map View */
          <div className="h-[600px] rounded-lg overflow-hidden">
            <GoogleMap
              center={userLocation || { lat: 40.7128, lng: -74.006 }}
              professionals={filteredProfessionals}
              userLocation={userLocation}
              onProfessionalSelect={handleBookService}
            />
          </div>
        ) : (
          /* List View */
          <div className="grid gap-4">
            {filteredProfessionals.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredProfessionals.map((professional) => (
                <Card key={professional.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-orange-100 text-orange-800 text-lg">
                            {professional.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{professional.name}</h3>
                            <div className="flex items-center space-x-2">
                              {professional.isAvailable ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Available Now</Badge>
                              ) : (
                                <Badge variant="secondary">Busy</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{professional.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{professional.distance}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{professional.completedServices} services</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {professional.services.map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-lg font-semibold text-gray-900">${professional.price}</div>
                            <Button
                              onClick={() => handleBookService(professional)}
                              disabled={!professional.isAvailable}
                              className="barza-gradient text-white"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        professional={selectedProfessional}
      />
    </div>
  )
}
