/**
 * Geolocation utilities for calculating distances and geocoding addresses
 */

export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(point2.latitude - point1.latitude)
  const dLon = toRad(point2.longitude - point1.longitude)

  const lat1 = toRad(point1.latitude)
  const lat2 = toRad(point2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Filter items by distance from user location
 */
export function filterByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates,
  maxDistanceKm: number
): T[] {
  return items.filter((item) => {
    if (!item.latitude || !item.longitude) return false
    const distance = calculateDistance(userLocation, {
      latitude: item.latitude,
      longitude: item.longitude,
    })
    return distance <= maxDistanceKm
  })
}

/**
 * Sort items by distance from user location (closest first)
 */
export function sortByDistance<T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLocation: Coordinates
): T[] {
  return [...items].sort((a, b) => {
    if (!a.latitude || !a.longitude) return 1
    if (!b.latitude || !b.longitude) return -1

    const distA = calculateDistance(userLocation, {
      latitude: a.latitude,
      longitude: a.longitude,
    })
    const distB = calculateDistance(userLocation, {
      latitude: b.latitude,
      longitude: b.longitude,
    })

    return distA - distB
  })
}

/**
 * Geocode an address to coordinates
 * TODO: Integrate with backend geocoding service (Google Maps API, etc.)
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  // TODO: Replace with actual geocoding API call to backend
  // For now, return mock coordinates for Toronto areas
  const torontoCoordinates: Record<string, Coordinates> = {
    "Downtown Toronto": { latitude: 43.6532, longitude: -79.3832 },
    "North York": { latitude: 43.7615, longitude: -79.4111 },
    "Scarborough": { latitude: 43.7731, longitude: -79.2578 },
    "Etobicoke": { latitude: 43.6205, longitude: -79.5132 },
    "Mississauga": { latitude: 43.5890, longitude: -79.6441 },
    "Brampton": { latitude: 43.7315, longitude: -79.7624 },
    "Markham": { latitude: 43.8561, longitude: -79.3370 },
    "Richmond Hill": { latitude: 43.8828, longitude: -79.4403 },
    "Vaughan": { latitude: 43.8361, longitude: -79.4983 },
  }

  // Try to match neighborhood
  for (const [neighborhood, coords] of Object.entries(torontoCoordinates)) {
    if (address.toLowerCase().includes(neighborhood.toLowerCase())) {
      return coords
    }
  }

  // Default to Downtown Toronto
  return { latitude: 43.6532, longitude: -79.3832 }
}

/**
 * Get user's current location from browser geolocation API
 */
export function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}
