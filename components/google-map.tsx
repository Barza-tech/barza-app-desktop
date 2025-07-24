"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

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

interface GoogleMapProps {
  center: { lat: number; lng: number }
  professionals: Professional[]
  userLocation: { lat: number; lng: number } | null
  onProfessionalSelect: (professional: Professional) => void
}

export function GoogleMap({ center, professionals, userLocation, onProfessionalSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Mock Google Maps implementation
    // In a real app, you would load the Google Maps JavaScript API
    if (mapRef.current && !mapInstanceRef.current) {
      // Simulate map initialization
      mapInstanceRef.current = true
    }
  }, [])

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Mock Map Background */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e5e7eb' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        )}

        {/* Professional Markers */}
        {professionals.map((professional, index) => (
          <div
            key={professional.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${45 + ((index * 15) % 40)}%`,
              top: `${35 + ((index * 10) % 30)}%`,
            }}
            onClick={() => onProfessionalSelect(professional)}
          >
            {/* Marker */}
            <div
              className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                professional.isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>

            {/* Info Card on Hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <Card className="w-64 shadow-lg">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{professional.name}</h4>
                      {professional.isAvailable && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Available</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{professional.rating}</span>
                      <span>•</span>
                      <span>{professional.distance}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {professional.services.slice(0, 2).join(", ")}
                      {professional.services.length > 2 && "..."}
                    </div>
                    <div className="text-lg font-semibold">${professional.price}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button size="sm" variant="outline" className="bg-white">
            +
          </Button>
          <Button size="sm" variant="outline" className="bg-white">
            -
          </Button>
        </div>

        {/* Map Attribution */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          Mock Google Maps
        </div>
      </div>
    </div>
  )
}
