"use client"

import { useEffect, useState, useRef, useCallback } from "react"
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

interface GoogleMapProps {
  center: { lat: number; lng: number }
  professionals: Professional[]
  userLocation: { lat: number; lng: number } | null
  onProfessionalSelect: (professional: Professional) => void
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export function GoogleMap({
  center,
  professionals,
  userLocation,
  onProfessionalSelect,
  onLocationUpdate,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { t } = useLanguage()

  // Initialize map once
  const initializeMap = useCallback(async () => {
    if (mapInstanceRef.current || !mapRef.current) return

    try {
      console.log("Starting map initialization...")

      // Load Leaflet if not already loaded
      if (!window.L) {
        console.log("Loading Leaflet...")

        // Add CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Add JS and wait for it
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

        await new Promise<void>((resolve, reject) => {
          script.onload = () => {
            console.log("Leaflet loaded successfully")
            resolve()
          }
          script.onerror = () => {
            console.error("Failed to load Leaflet")
            reject(new Error("Failed to load Leaflet"))
          }
          document.head.appendChild(script)
        })

        // Small delay to ensure Leaflet is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      console.log("Creating map instance...")

      // Create map
      const map = window.L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: 14,
        zoomControl: false,
      })

      // Add tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      // Add click handler
      map.on("click", (e: any) => {
        if (isUpdatingLocation && onLocationUpdate) {
          onLocationUpdate({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          })
          setIsUpdatingLocation(false)
          toast({
            title: "📍 Location Updated",
            description: "Your location has been updated",
          })
        }
      })

      mapInstanceRef.current = map
      console.log("Map initialized successfully")
      setIsReady(true)
    } catch (err) {
      console.error("Map initialization error:", err)
      setError("Failed to load map")
    }
  }, [center, isUpdatingLocation, onLocationUpdate, toast])

  // Initialize on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeMap()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (e) {
          console.log("Cleanup error:", e)
        }
      }
    }
  }, [initializeMap])

  // Update markers when ready
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.L) return

    console.log("Updating markers...")
    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        map.removeLayer(marker)
      } catch (e) {
        console.log("Error removing marker:", e)
      }
    })
    markersRef.current = []

    // Create icon function
    const createIcon = (color: string, emoji: string) => {
      return window.L.divIcon({
        html: `<div style="
          width: 30px; height: 30px; 
          background: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          font-size: 14px;
        ">${emoji}</div>`,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })
    }

    // Add user marker
    if (userLocation) {
      const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
        icon: createIcon("#3B82F6", "📍"),
      }).addTo(map)

      userMarker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>Your Location</strong><br>
          <small>${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</small>
        </div>
      `)

      markersRef.current.push(userMarker)
    }

    // Add professional markers
    professionals.forEach((prof) => {
      const marker = window.L.marker([prof.location.lat, prof.location.lng], {
        icon: createIcon(prof.isAvailable ? "#10B981" : "#6B7280", "💼"),
      }).addTo(map)

      marker.bindPopup(`
        <div style="padding: 12px; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong>${prof.name}</strong>
            <span style="background: ${prof.isAvailable ? "#D1FAE5" : "#F3F4F6"}; 
                         color: ${prof.isAvailable ? "#065F46" : "#374151"}; 
                         padding: 2px 6px; border-radius: 8px; font-size: 11px;">
              ${prof.isAvailable ? "Available" : "Busy"}
            </span>
          </div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
            ⭐ ${prof.rating.toFixed(1)} • 📍 ${prof.distance} • 👤 ${prof.completedServices}
          </div>
          <div style="margin-bottom: 8px;">
            ${prof.services
              .slice(0, 2)
              .map(
                (s) =>
                  `<span style="background: #F3F4F6; padding: 2px 4px; border-radius: 4px; font-size: 10px; margin-right: 4px;">${s}</span>`,
              )
              .join("")}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 16px;">$${prof.price}</strong>
            <button onclick="window.bookProfessional('${prof.id}')" 
                    style="background: ${prof.isAvailable ? "linear-gradient(135deg, #ff6b35, #f7931e)" : "#9CA3AF"}; 
                           color: white; border: none; padding: 4px 8px; border-radius: 4px; 
                           font-size: 11px; cursor: ${prof.isAvailable ? "pointer" : "not-allowed"};"
                    ${!prof.isAvailable ? "disabled" : ""}>
              ${prof.isAvailable ? "Book Now" : "Busy"}
            </button>
          </div>
        </div>
      `)

      markersRef.current.push(marker)
    })

    // Global booking function
    window.bookProfessional = (id: string) => {
      const prof = professionals.find((p) => p.id === id)
      if (prof) onProfessionalSelect(prof)
    }
  }, [isReady, professionals, userLocation, onProfessionalSelect])

  // Update center
  useEffect(() => {
    if (isReady && mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng])
    }
  }, [center, isReady])

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()

  const handleUpdateLocation = () => {
    setIsUpdatingLocation(true)
    toast({
      title: "📍 Click on Map",
      description: "Click anywhere to set your location",
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

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="font-bold text-red-800 mb-2">Map Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 text-white hover:bg-red-700">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (!isReady) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-semibold text-gray-800 mb-2">Loading Map</h3>
          <p className="text-gray-600 text-sm">Please wait a moment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ cursor: isUpdatingLocation ? "crosshair" : "default" }} />

      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        {/* Zoom */}
        <div className="bg-white rounded-lg shadow-lg border">
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 rounded-b-none border-b" onClick={handleZoomIn}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="w-10 h-10 p-0 rounded-t-none" onClick={handleZoomOut}>
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Location */}
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
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-3 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{professionals.filter((p) => p.isAvailable).length} available</span>
        </div>
      </div>

      {/* Location Update Modal */}
      {isUpdatingLocation && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[1001]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="font-bold text-xl mb-2">Update Location</h3>
            <p className="text-gray-600 mb-4 text-sm">Click anywhere on the map or use GPS</p>
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
