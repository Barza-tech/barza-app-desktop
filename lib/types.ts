export type UserType = "client" | "professional" | "admin"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  userType: UserType
  isVerified: boolean
  createdAt: Date
  avatar?: string
}

export interface Professional {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  distance: string
  services: string[]
  isAvailable: boolean
  location: {
    lat: number
    lng: number
    address?: string
  }
  price: string
  specialties: string[]
}

export interface Booking {
  id: string
  clientId: string
  professionalId: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  price: number
  notes?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}
