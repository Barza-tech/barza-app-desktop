"use client"

import { AuthContextType } from "../pages/api/auth/auth-types"
import type { User } from "../pages/api/auth/auth-types"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [reloadCounter, setReloadCounter] = useState<number>(0) // ✅ contador para forçar re-render

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        return
      }

      const data = await res.json()
      const mappedUser: User = {
        id: data.id,
        name: data.user_metadata?.full_name || data.email.split("@")[0],
        email: data.email,
        phone: data.phone || "+351 900 000 000",
        user_Type:
          data.app_metadata?.role === "professional"
            ? "professional"
            : "client",
      }
      setUser(mappedUser)
    } catch (err) {
      console.error("Error fetching user:", err)
      setUser(null)
    }
  }

  useEffect(() => {
    const checkUserSession = async () => {
      const sessionCookie = getCookie("access_token")
      if (sessionCookie) {
        console.log("Cookie encontrado. A validar sessão...")
        await fetchUser()
      } else {
        console.log("Nenhum cookie de sessão encontrado.")
        setUser(null)
      }
      setLoading(false)
    }
    checkUserSession()
  }, [])

  useEffect(() => {
    if (!user && !loading) {
      const timer = setTimeout(() => {
        console.log("⏳ Auto refresh: tentando buscar user novamente...")
        setLoading(true)
        fetchUser()
          .finally(() => setLoading(false))
          .finally(() => setReloadCounter(prev => prev + 1)) // força re-render
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [user, loading, reloadCounter])

  const login = async (email: string, password: string) => {
    console.log("Logging in with:", email, password)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!res.ok) return false
      await fetchUser()

      return true
    } catch (err) {
      console.error("Login error:", err)
      return false
    }
  }
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
