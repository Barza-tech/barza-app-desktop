"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: "client" | "professional" | "admin"
  isVerified: boolean
  location?: {
    lat: number
    lng: number
  }
  professionalInfo?: {
    services: string[]
    isAvailable: boolean
    rating: number
    completedServices: number
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  verifyCode: (code: string) => Promise<boolean>
  updateLocation: (location: { lat: number; lng: number }) => void
  toggleAvailability: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("barza-user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUser(user)

      // Auto-redirect based on user type
      if (user.isVerified) {
        if (user.userType === "client") {
          window.location.href = "/client/dashboard"
        } else if (user.userType === "professional") {
          window.location.href = "/professional/dashboard"
        } else if (user.userType === "admin") {
          window.location.href = "/admin/dashboard"
        }
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      phone: "+1234567890",
      userType: email.includes("barber") ? "professional" : "client",
      isVerified: true,
      location: { lat: 40.7128, lng: -74.006 },
      professionalInfo: email.includes("barber")
        ? {
            services: ["Haircut", "Beard Trim", "Styling"],
            isAvailable: false,
            rating: 4.8,
            completedServices: 156,
          }
        : undefined,
    }

    setUser(mockUser)
    localStorage.setItem("barza-user", JSON.stringify(mockUser))
    return true
  }

  const register = async (userData: any): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      isVerified: false,
      professionalInfo:
        userData.userType === "professional"
          ? {
              services: [],
              isAvailable: false,
              rating: 0,
              completedServices: 0,
            }
          : undefined,
    }

    setUser(newUser)
    localStorage.setItem("barza-user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("barza-user")
  }

  const verifyCode = async (code: string): Promise<boolean> => {
    if (user && code === "123456") {
      const verifiedUser = { ...user, isVerified: true }
      setUser(verifiedUser)
      localStorage.setItem("barza-user", JSON.stringify(verifiedUser))
      return true
    }
    return false
  }

  const updateLocation = (location: { lat: number; lng: number }) => {
    if (user) {
      const updatedUser = { ...user, location }
      setUser(updatedUser)
      localStorage.setItem("barza-user", JSON.stringify(updatedUser))
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
      localStorage.setItem("barza-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        verifyCode,
        updateLocation,
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
