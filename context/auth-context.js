"use client"

import { createContext, useState, useEffect, useContext } from "react"
import api from "@/services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for user in localStorage first (for persistent sessions)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Error parsing stored user:", e)
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const response = await api.auth.verifyToken()
        if (response && response.user) {
          setUser(response.user)
        }
      } catch (error) {
        console.error("Token verification failed:", error)
        // Clear invalid token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Only verify if we have a token
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      verifyToken()
    }
  }, [])

  const login = async (email, password) => {
    try {
      // Call backend login API
      const response = await api.auth.login({ email, password })

      if (response && response.token && response.user) {
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        setUser(response.user)
        return response.user
      }

      throw new Error("Invalid response from server")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (email, password, name, role = "lawyer") => {
    try {
      // Call backend registration API
      const response = await api.auth.register({
        email,
        password,
        name,
        role,
      })

      if (response && response.token && response.user) {
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        setUser(response.user)
        return response.user
      }

      throw new Error("Invalid response from server")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      // In a real implementation, you would handle Google OAuth
      // For now, we'll assume your backend has a Google auth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return data.user
      }

      throw new Error("Google authentication failed")
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call backend logout API
      await api.auth.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear local storage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
