"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Crosshair, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
  locationInfo?: LocationInfo
}

interface StaticMapProps {
  center: { lat: number; lng: number }
  professionals: Professional[]
  userLocation: { lat: number; lng: number } | null
  onProfessionalSelect: (professional: Professional) => void
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
  userLocationInfo?: LocationInfo
}

export function StaticMap({
  center,
  professionals,
  userLocation,
  onProfessionalSelect,
  onLocationUpdate,
  userLocationInfo,
}: StaticMapProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const [professionalsWithLocation, setProfessionalsWithLocation] = useState<Professional[]>(professionals)
  const { toast } = useToast()

  // Geocode professionals locations
  useEffect(() => {
    const geocodeProfessionals = async () => {
      const updatedProfessionals = await Promise.all(
        professionals.map(async (prof) => {
          if (!prof.locationInfo) {
            try {
              const locationInfo = await reverseGeocode(prof.location.lat, prof.location.lng)
              return { ...prof, locationInfo }
            } catch (error) {
              console.error("Error geocoding professional location:", error)
              return prof
            }
          }
          return prof
        }),
      )
      setProfessionalsWithLocation(updatedProfessionals)
    }

    geocodeProfessionals()
  }, [professionals])

  // Calculate relative positions for visual representation
  const getRelativePosition = (location: { lat: number; lng: number }) => {
    const latRange = 0.02 // ~2km range
    const lngRange = 0.02

    const x = ((location.lng - center.lng + lngRange / 2) / lngRange) * 100
    const y = ((center.lat - location.lat + latRange / 2) / latRange) * 100

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    }
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isUpdatingLocation || !onLocationUpdate) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    // Convert click position to lat/lng
    const latRange = 0.02
    const lngRange = 0.02

    const newLocation = {
      lat: center.lat + latRange / 2 - y * latRange,
      lng: center.lng - lngRange / 2 + x * lngRange,
    }

    onLocationUpdate(newLocation)
    setIsUpdatingLocation(false)
    toast({
      title: "📍 Location Updated",
      description: "Your location has been updated",
    })
  }

  const handleProfessionalClick = (professional: Professional) => {
    setSelectedProfessional(professional)
    onProfessionalSelect(professional)
  }

  const handleUpdateLocation = () => {
    setIsUpdatingLocation(true)
    toast({
      title: "📍 Click on Map",
      description: "Click anywhere on the map to set your location",
    })
  }

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          if (onLocationUpdate) {
            onLocationUpdate(newLocation)
          }
          setIsUpdatingLocation(false)
          toast({
            title: "🎯 GPS Updated",
            description: "Location updated successfully",
          })
        },
        () => {
          toast({
            title: "❌ GPS Failed",
            description: "Could not get GPS location",
            variant: "destructive",
          })
        },
      )
    }
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
      {/* Map Background */}
      <div
        className="w-full h-full relative cursor-pointer"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)
          `,
          cursor: isUpdatingLocation ? "crosshair" : "default",
        }}
      >
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${getRelativePosition(userLocation).x}%`,
              top: `${getRelativePosition(userLocation).y}%`,
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap max-w-48 text-center">
                <div className="font-semibold">Your Location</div>
                {userLocationInfo && <div className="text-blue-100 text-xs mt-1">{userLocationInfo.shortAddress}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Professional Markers */}
        {professionalsWithLocation.map((professional) => {
          const position = getRelativePosition(professional.location)
          return (
            <div
              key={professional.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleProfessionalClick(professional)
              }}
            >
              <div className="relative group">
                <div
                  className={`w-8 h-8 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 ${
                    professional.isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  ✂️
                </div>

                {/* Enhanced Tooltip with Location */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-white rounded-lg shadow-lg p-4 min-w-64 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{professional.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          professional.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {professional.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>

                    {/* Location Info */}
                    {professional.locationInfo && (
                      <div className="flex items-start space-x-1 mb-2 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{professional.locationInfo.shortAddress}</div>
                          {professional.locationInfo.neighborhood && (
                            <div className="text-gray-500">{professional.locationInfo.neighborhood}</div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-600 mb-2">
                      ⭐ {professional.rating.toFixed(1)} • 📍 {professional.distance} • 👤{" "}
                      {professional.completedServices}
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      <div className="flex flex-wrap gap-1">
                        {professional.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                        {professional.services.length > 3 && (
                          <span className="text-gray-500">+{professional.services.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">${professional.price}</span>
                      <button
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          professional.isAvailable
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!professional.isAvailable}
                      >
                        {professional.isAvailable ? "Book Now" : "Busy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Location Update Overlay */}
        {isUpdatingLocation && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm mx-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Crosshair className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="font-bold text-xl mb-2">Update Location</h3>
              <p className="text-gray-600 mb-4 text-sm">Click anywhere on the map or use GPS</p>
              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUpdatingLocation(false)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUseGPS()
                  }}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Use GPS
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-20">
        <Button
          size="sm"
          variant={isUpdatingLocation ? "default" : "outline"}
          className="w-10 h-10 p-0 bg-white shadow-lg"
          onClick={handleUpdateLocation}
        >
          <Crosshair className="w-4 h-4" />
        </Button>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-3 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {professionalsWithLocation.filter((p) => p.isAvailable).length} available nearby
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border p-3 z-20">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border border-white"></div>
            <span>Available Barber</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full border border-white"></div>
            <span>Busy Barber</span>
          </div>
        </div>
      </div>

      {/* Location Display */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 z-20 max-w-48">
        <div className="text-xs text-gray-600">
          <div className="font-semibold mb-1">Current Area</div>
          {userLocationInfo ? (
            <div>
              <div className="font-medium">{userLocationInfo.city || "Unknown City"}</div>
              <div className="text-gray-500">{userLocationInfo.country || "Unknown Country"}</div>
            </div>
          ) : (
            <div>
              <div>Lat: {center.lat.toFixed(4)}</div>
              <div>Lng: {center.lng.toFixed(4)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
