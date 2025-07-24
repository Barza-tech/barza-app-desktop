"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: "client" | "professional" | "admin"
  isVerified: boolean
  profileImage?: string
  preferences?: {
    notifications: boolean
    language: string
    theme: string
  }
  professionalInfo?: {
    isAvailable: boolean
    rating: number
    completedServices: number
    services: string[]
    location?: { lat: number; lng: number }
  }
  clientInfo?: {
    bookingHistory: any[]
    favoriteBarbers: string[]
    totalBookings: number
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<boolean>
  verifyCode: (code: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: any) => void
  toggleAvailability: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@client.com",
    phone: "+351 912 345 678",
    userType: "client",
    isVerified: true,
    preferences: {
      notifications: true,
      language: "pt",
      theme: "light",
    },
    clientInfo: {
      bookingHistory: [],
      favoriteBarbers: [],
      totalBookings: 5,
    },
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@barber.com",
    phone: "+351 913 456 789",
    userType: "professional",
    isVerified: true,
    preferences: {
      notifications: true,
      language: "pt",
      theme: "light",
    },
    professionalInfo: {
      isAvailable: true,
      rating: 4.8,
      completedServices: 127,
      services: ["Haircut", "Beard Trim", "Styling"],
      location: { lat: 38.7223, lng: -9.1393 },
    },
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@barza.com",
    phone: "+351 914 567 890",
    userType: "admin",
    isVerified: true,
    preferences: {
      notifications: true,
      language: "en",
      theme: "light",
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [pendingUser, setPendingUser] = useState<any>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("barza-user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error loading user from storage:", error)
        localStorage.removeItem("barza-user")
      }
    }
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("barza-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("barza-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock database
      const foundUser = mockUsers.find((u) => u.email === email)

      if (foundUser) {
        setUser(foundUser)
        return true
      }

      // If not found in mock users, create a new user based on email
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        phone: "+351 900 000 000",
        userType: email.includes("barber") || email.includes("professional") ? "professional" : "client",
        isVerified: true,
        preferences: {
          notifications: true,
          language: "pt",
          theme: "light",
        },
        ...(email.includes("barber") || email.includes("professional")
          ? {
              professionalInfo: {
                isAvailable: true,
                rating: 4.5,
                completedServices: 0,
                services: ["Haircut", "Beard Trim"],
                location: { lat: 38.7223, lng: -9.1393 },
              },
            }
          : {
              clientInfo: {
                bookingHistory: [],
                favoriteBarbers: [],
                totalBookings: 0,
              },
            }),
      }

      setUser(newUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (data: any): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        userType: data.userType,
        isVerified: false,
        preferences: {
          notifications: true,
          language: "pt",
          theme: "light",
        },
        ...(data.userType === "professional"
          ? {
              professionalInfo: {
                isAvailable: false,
                rating: 0,
                completedServices: 0,
                services: ["Haircut"],
                location: { lat: 38.7223, lng: -9.1393 },
              },
            }
          : {
              clientInfo: {
                bookingHistory: [],
                favoriteBarbers: [],
                totalBookings: 0,
              },
            }),
      }

      setPendingUser(newUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const verifyCode = async (code: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Accept any 6-digit code for demo
      if (code.length === 6 && pendingUser) {
        const verifiedUser = { ...pendingUser, isVerified: true }
        setUser(verifiedUser)
        setPendingUser(null)
        return true
      }

      return false
    } catch (error) {
      console.error("Verification error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setPendingUser(null)
    localStorage.removeItem("barza-user")
  }

  const updateProfile = (data: any) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
    }
  }

  const toggleAvailability = () => {
    if (user && user.professionalInfo) {
      const updatedUser = {
        ...user,
        professionalInfo: {
          ...user.professionalInfo,
          isAvailable: !user.professionalInfo.isAvailable,
        },
      }
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyCode,
        logout,
        updateProfile,
        toggleAvailability,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
