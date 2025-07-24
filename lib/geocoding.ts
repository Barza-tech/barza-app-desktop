export interface LocationInfo {
  country: string
  city: string
  neighborhood?: string
  shortAddress: string
  fullAddress: string
}

// Rate limiting for API calls
const rateLimiter = {
  calls: 0,
  resetTime: Date.now() + 60000, // Reset every minute
  maxCalls: 50, // Max 50 calls per minute

  canMakeCall(): boolean {
    const now = Date.now()
    if (now > this.resetTime) {
      this.calls = 0
      this.resetTime = now + 60000
    }
    return this.calls < this.maxCalls
  },

  recordCall(): void {
    this.calls++
  },
}

// Cache for geocoding results
const geocodeCache = new Map<string, LocationInfo>()

// Fallback location detection based on coordinates
function detectLocationByCoordinates(lat: number, lng: number): LocationInfo {
  // Major cities detection by approximate coordinates
  const cities = [
    { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, radius: 0.5 },
    { name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291, radius: 0.5 },
    { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, radius: 0.5 },
    { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, radius: 0.5 },
    { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, radius: 0.5 },
    { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, radius: 0.5 },
    { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, radius: 0.5 },
    { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, radius: 0.5 },
  ]

  for (const city of cities) {
    const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2))
    if (distance <= city.radius) {
      return {
        country: city.country,
        city: city.name,
        shortAddress: city.name,
        fullAddress: `${city.name}, ${city.country}`,
      }
    }
  }

  // Country detection by geographic regions
  if (lat >= 36.0 && lat <= 42.0 && lng >= -9.5 && lng <= -6.0) {
    return {
      country: "Portugal",
      city: "Unknown City",
      shortAddress: "Portugal",
      fullAddress: "Portugal",
    }
  } else if (lat >= 36.0 && lat <= 44.0 && lng >= -9.0 && lng <= 4.0) {
    return {
      country: "Spain",
      city: "Unknown City",
      shortAddress: "Spain",
      fullAddress: "Spain",
    }
  } else if (lat >= 42.0 && lat <= 51.0 && lng >= -5.0 && lng <= 8.0) {
    return {
      country: "France",
      city: "Unknown City",
      shortAddress: "France",
      fullAddress: "France",
    }
  } else if (lat >= 49.0 && lat <= 61.0 && lng >= -8.0 && lng <= 2.0) {
    return {
      country: "United Kingdom",
      city: "Unknown City",
      shortAddress: "United Kingdom",
      fullAddress: "United Kingdom",
    }
  }

  // Default fallback
  return {
    country: "Unknown Country",
    city: "Unknown City",
    shortAddress: `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
    fullAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  }
}

// Primary geocoding service - Nominatim OpenStreetMap
async function geocodeWithNominatim(lat: number, lng: number): Promise<LocationInfo> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    {
      headers: {
        "User-Agent": "Barza-App/1.0",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`)
  }

  const data = await response.json()

  if (!data || !data.address) {
    throw new Error("No address data returned from Nominatim")
  }

  const address = data.address
  const country = address.country || "Unknown Country"
  const city = address.city || address.town || address.village || address.municipality || "Unknown City"
  const neighborhood = address.neighbourhood || address.suburb || address.quarter

  return {
    country,
    city,
    neighborhood,
    shortAddress: neighborhood ? `${neighborhood}, ${city}` : city,
    fullAddress: data.display_name || `${city}, ${country}`,
  }
}

// Backup geocoding service - BigDataCloud
async function geocodeWithBigDataCloud(lat: number, lng: number): Promise<LocationInfo> {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
  )

  if (!response.ok) {
    throw new Error(`BigDataCloud API error: ${response.status}`)
  }

  const data = await response.json()

  const country = data.countryName || "Unknown Country"
  const city = data.city || data.locality || data.principalSubdivision || "Unknown City"
  const neighborhood = data.localityInfo?.administrative?.[3]?.name

  return {
    country,
    city,
    neighborhood,
    shortAddress: neighborhood ? `${neighborhood}, ${city}` : city,
    fullAddress: `${city}, ${country}`,
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationInfo> {
  // Create cache key
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`

  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!
  }

  // Check rate limiting
  if (!rateLimiter.canMakeCall()) {
    console.warn("Rate limit exceeded, using coordinate-based detection")
    const fallback = detectLocationByCoordinates(lat, lng)
    geocodeCache.set(cacheKey, fallback)
    return fallback
  }

  try {
    rateLimiter.recordCall()

    // Try primary service (Nominatim)
    const result = await geocodeWithNominatim(lat, lng)
    geocodeCache.set(cacheKey, result)
    return result
  } catch (nominatimError) {
    console.warn("Nominatim failed, trying BigDataCloud:", nominatimError)

    try {
      // Try backup service (BigDataCloud)
      const result = await geocodeWithBigDataCloud(lat, lng)
      geocodeCache.set(cacheKey, result)
      return result
    } catch (bigDataCloudError) {
      console.warn("BigDataCloud failed, using coordinate detection:", bigDataCloudError)

      // Final fallback - coordinate-based detection
      const fallback = detectLocationByCoordinates(lat, lng)
      geocodeCache.set(cacheKey, fallback)
      return fallback
    }
  }
}
