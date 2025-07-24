"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Crosshair, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

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

interface LeafletMapProps {
  center: { lat: number; lng: number }
  professionals: Professional[]
  userLocation: { lat: number; lng: number } | null
  onProfessionalSelect: (professional: Professional) => void
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export function LeafletMap({
  center,
  professionals,
  userLocation,
  onProfessionalSelect,
  onLocationUpdate,
}: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const { toast } = useToast()
  const { t } = useLanguage()

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true)

    // Dynamic import of Leaflet
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet")

      // Fix for default markers
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      setL(leaflet)
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isClient || !L || map) return

    const mapInstance = L.map("map-container").setView([center.lat, center.lng], 14)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance)

    // Add click event for location updates
    mapInstance.on("click", (e: any) => {
      if (isUpdatingLocation) {
        const newLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        }

        if (onLocationUpdate) {
          onLocationUpdate(newLocation)
        }

        setIsUpdatingLocation(false)
        toast({
          title: "📍 Location Updated",
          description: "Your location has been updated on the map",
        })
      }
    })

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [isClient, L, center, isUpdatingLocation, onLocationUpdate, toast])

  // Create custom icons
  const createCustomIcon = (color: string, icon: string) => {
    if (!L) return null

    return L.divIcon({
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 14px;
          color: white;
        ">
          ${icon}
        </div>
      `,
      className: "custom-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    })
  }

  // Update markers
  useEffect(() => {
    if (!map || !L) return

    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker))
    const newMarkers: any[] = []

    // Add user location marker
    if (userLocation) {
      const userIcon = createCustomIcon("#3B82F6", "📍")
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
              <strong>Your Location</strong>
            </div>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}
            </p>
          </div>
        `)

      newMarkers.push(userMarker)
    }

    // Add professional markers
    professionals.forEach((professional) => {
      const icon = createCustomIcon(professional.isAvailable ? "#10B981" : "#6B7280", "💼")

      const marker = L.marker([professional.location.lat, professional.location.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 12px; max-width: 280px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1F2937;">${professional.name}</h3>
              ${
                professional.isAvailable
                  ? '<span style="background: #D1FAE5; color: #065F46; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Available</span>'
                  : '<span style="background: #F3F4F6; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Busy</span>'
              }
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #6B7280;">
              <span>⭐ ${professional.rating.toFixed(1)}</span>
              <span>📍 ${professional.distance}</span>
              <span>👤 ${professional.completedServices}</span>
            </div>
            
            <div style="margin-bottom: 12px;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #6B7280; font-weight: 500;">Services:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${professional.services
                  .slice(0, 3)
                  .map(
                    (service) =>
                      `<span style="background: #F3F4F6; color: #374151; padding: 2px 6px; border-radius: 8px; font-size: 11px;">${service}</span>`,
                  )
                  .join("")}
                ${professional.services.length > 3 ? `<span style="background: #F3F4F6; color: #374151; padding: 2px 6px; border-radius: 8px; font-size: 11px;">+${professional.services.length - 3} more</span>` : ""}
              </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E5E7EB;">
              <span style="font-size: 18px; font-weight: bold; color: #1F2937;">$${professional.price}</span>
              <button 
                onclick="window.selectProfessional('${professional.id}')"
                style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; ${!professional.isAvailable ? "opacity: 0.5; cursor: not-allowed;" : ""}"
                ${!professional.isAvailable ? "disabled" : ""}
              >
                ${professional.isAvailable ? "Book Now" : "Busy"}
              </button>
            </div>
          </div>
        `)

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Add global function to handle booking
    ;(window as any).selectProfessional = (professionalId: string) => {
      const professional = professionals.find((p) => p.id === professionalId)
      if (professional) {
        onProfessionalSelect(professional)
      }
    }
  }, [map, L, professionals, userLocation, onProfessionalSelect])

  // Update map center
  useEffect(() => {
    if (map) {
      map.setView([center.lat, center.lng], map.getZoom())
    }
  }, [map, center])

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  const handleUpdateLocation = () => {
    setIsUpdatingLocation(true)
    toast({
      title: "📍 Location Update Mode",
      description: "Click anywhere on the map to set your new location",
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

          if (map) {
            map.setView([newLocation.lat, newLocation.lng], map.getZoom())
          }

          setIsUpdatingLocation(false)

          toast({
            title: "🎯 GPS Location Updated",
            description: `Located with ${Math.round(position.coords.accuracy)}m accuracy`,
          })
        },
        (error) => {
          toast({
            title: "❌ GPS Error",
            description: "Could not get your GPS location. Try clicking on the map instead.",
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    }
  }

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Map...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we initialize the map</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* Map Container */}
      <div
        id="map-container"
        className="w-full h-full"
        style={{
          cursor: isUpdatingLocation ? "crosshair" : "default",
        }}
      />

      {/* Custom Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
          <Button
            size="sm"
            variant="ghost"
            className="w-10 h-10 p-0 rounded-none border-b hover:bg-gray-50"
            onClick={handleZoomIn}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-10 h-10 p-0 rounded-none hover:bg-gray-50"
            onClick={handleZoomOut}
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Location Button */}
        <Button
          size="sm"
          variant={isUpdatingLocation ? "default" : "outline"}
          className={`w-10 h-10 p-0 bg-white shadow-lg border hover:bg-gray-50 ${
            isUpdatingLocation ? "bg-blue-500 text-white hover:bg-blue-600" : ""
          }`}
          onClick={handleUpdateLocation}
        >
          <Crosshair className="w-4 h-4" />
        </Button>
      </div>

      {/* Professional Count Badge */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-3 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">
            {professionals.filter((p) => p.isAvailable).length} available nearby
          </span>
        </div>
      </div>

      {/* Location Update Instructions */}
      {isUpdatingLocation && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[1001]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Update Your Location</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Click anywhere on the map to set your new location, or use GPS for automatic detection.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline" onClick={() => setIsUpdatingLocation(false)} className="flex-1">
                Cancel
              </Button>
              <Button size="sm" onClick={handleUseGPS} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                Use GPS
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
