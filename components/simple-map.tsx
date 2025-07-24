"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Crosshair, Plus, Minus } from "lucide-react"
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
}

interface SimpleMapProps {
  center: { lat: number; lng: number }
  professionals: Professional[]
  userLocation: { lat: number; lng: number } | null
  onProfessionalSelect: (professional: Professional) => void
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export function SimpleMap({
  center,
  professionals,
  userLocation,
  onProfessionalSelect,
  onLocationUpdate,
}: SimpleMapProps) {
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">("loading")
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markers = useRef<any[]>([])
  const { toast } = useToast()

  // Simple initialization
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const init = async () => {
      try {
        console.log("🗺️ Starting map initialization...")

        // Set timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.error("⏰ Map initialization timeout")
            setMapState("error")
          }
        }, 10000)

        // Wait for DOM
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (!mounted || !mapRef.current) return

        // Load Leaflet
        if (!window.L) {
          console.log("📦 Loading Leaflet...")

          // CSS
          const css = document.createElement("link")
          css.rel = "stylesheet"
          css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(css)

          // JS
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log("✅ Leaflet loaded")
              resolve()
            }
            script.onerror = () => {
              console.error("❌ Leaflet failed to load")
              reject(new Error("Leaflet load failed"))
            }
            document.head.appendChild(script)
          })

          // Wait a bit more
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        if (!mounted) return

        console.log("🗺️ Creating map...")

        // Create map
        const map = window.L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: 14,
          zoomControl: false,
        })

        // Add tiles
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(map)

        // Click handler
        map.on("click", (e: any) => {
          if (isUpdatingLocation && onLocationUpdate) {
            onLocationUpdate({ lat: e.latlng.lat, lng: e.latlng.lng })
            setIsUpdatingLocation(false)
            toast({ title: "📍 Location Updated" })
          }
        })

        mapInstance.current = map
        clearTimeout(timeoutId)

        if (mounted) {
          console.log("✅ Map ready!")
          setMapState("ready")
        }
      } catch (error) {
        console.error("❌ Map error:", error)
        clearTimeout(timeoutId)
        if (mounted) {
          setMapState("error")
        }
      }
    }

    init()

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      if (mapInstance.current) {
        try {
          mapInstance.current.remove()
          mapInstance.current = null
        } catch (e) {
          console.log("Cleanup error:", e)
        }
      }
    }
  }, []) // Empty deps - only run once

  // Update markers when ready
  useEffect(() => {
    if (mapState !== "ready" || !mapInstance.current || !window.L) return

    console.log("🎯 Updating markers...")

    // Clear old markers
    markers.current.forEach((marker) => {
      try {
        mapInstance.current.removeLayer(marker)
      } catch (e) {
        console.log("Marker cleanup error:", e)
      }
    })
    markers.current = []

    // Simple icon creator
    const createIcon = (color: string, text: string) => {
      return window.L.divIcon({
        html: `<div style="
          width: 24px; height: 24px; 
          background: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 12px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${text}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
    }

    // User marker
    if (userLocation) {
      const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
        icon: createIcon("#3B82F6", "📍"),
      }).addTo(mapInstance.current)

      userMarker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>Your Location</strong>
        </div>
      `)

      markers.current.push(userMarker)
    }

    // Professional markers
    professionals.forEach((prof) => {
      const marker = window.L.marker([prof.location.lat, prof.location.lng], {
        icon: createIcon(prof.isAvailable ? "#10B981" : "#6B7280", "💼"),
      }).addTo(mapInstance.current)

      marker.bindPopup(`
        <div style="padding: 10px; min-width: 180px;">
          <div style="margin-bottom: 6px;">
            <strong>${prof.name}</strong>
            <span style="float: right; background: ${prof.isAvailable ? "#D1FAE5" : "#F3F4F6"}; 
                         color: ${prof.isAvailable ? "#065F46" : "#374151"}; 
                         padding: 1px 4px; border-radius: 4px; font-size: 10px;">
              ${prof.isAvailable ? "Available" : "Busy"}
            </span>
          </div>
          <div style="font-size: 11px; color: #666; margin-bottom: 6px;">
            ⭐ ${prof.rating.toFixed(1)} • 📍 ${prof.distance}
          </div>
          <div style="margin-bottom: 6px; font-size: 10px;">
            ${prof.services.slice(0, 2).join(", ")}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>$${prof.price}</strong>
            <button onclick="window.selectProf('${prof.id}')" 
                    style="background: ${prof.isAvailable ? "#ff6b35" : "#9CA3AF"}; 
                           color: white; border: none; padding: 2px 6px; 
                           border-radius: 3px; font-size: 10px; cursor: pointer;"
                    ${!prof.isAvailable ? "disabled" : ""}>
              ${prof.isAvailable ? "Book" : "Busy"}
            </button>
          </div>
        </div>
      `)

      markers.current.push(marker)
    })

    // Global function
    window.selectProf = (id: string) => {
      const prof = professionals.find((p) => p.id === id)
      if (prof) onProfessionalSelect(prof)
    }
  }, [mapState, professionals, userLocation, onProfessionalSelect])

  // Update center
  useEffect(() => {
    if (mapState === "ready" && mapInstance.current) {
      mapInstance.current.setView([center.lat, center.lng])
    }
  }, [center, mapState])

  // Controls
  const handleZoomIn = () => mapInstance.current?.zoomIn()
  const handleZoomOut = () => mapInstance.current?.zoomOut()
  const handleLocationUpdate = () => {
    setIsUpdatingLocation(true)
    toast({ title: "📍 Click on map to set location" })
  }

  // Error state
  if (mapState === "error") {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="font-bold text-red-800 mb-2">Map Failed to Load</h3>
          <p className="text-red-600 mb-4">There was a problem loading the map</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 text-white hover:bg-red-700">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (mapState === "loading") {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="font-semibold text-gray-800 mb-2">Loading Map</h3>
          <p className="text-gray-600 text-sm">This should only take a few seconds...</p>
          <div className="mt-4 text-xs text-gray-500">If this takes too long, try refreshing the page</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ cursor: isUpdatingLocation ? "crosshair" : "default" }} />

      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg border">
          <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-b-none border-b" onClick={handleZoomIn}>
            <Plus className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="w-8 h-8 p-0 rounded-t-none" onClick={handleZoomOut}>
            <Minus className="w-3 h-3" />
          </Button>
        </div>
        <Button
          size="sm"
          variant={isUpdatingLocation ? "default" : "outline"}
          className="w-8 h-8 p-0 bg-white shadow-lg"
          onClick={handleLocationUpdate}
        >
          <Crosshair className="w-3 h-3" />
        </Button>
      </div>

      {/* Status */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-2 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">{professionals.filter((p) => p.isAvailable).length} available</span>
        </div>
      </div>

      {/* Location update overlay */}
      {isUpdatingLocation && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[1001]">
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-xs mx-4 text-center">
            <Crosshair className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-pulse" />
            <h3 className="font-bold mb-2">Update Location</h3>
            <p className="text-sm text-gray-600 mb-3">Click anywhere on the map</p>
            <Button size="sm" variant="outline" onClick={() => setIsUpdatingLocation(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
