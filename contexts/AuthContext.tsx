'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client-browser'
import { signUpUser, signInUser, updateProfilePicture as updateProfilePictureAction } from '@/lib/auth-actions'

interface User {
  id: string
  name: string
  phone_number: string
  email: string
  profile_picture_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signIn: (phoneNumber: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfilePicture: (profilePictureUrl: string | null) => Promise<{ success: boolean; error?: string }>
}

interface SignUpData {
  name: string
  phoneNumber: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkUser = async () => {
      const storedUser = localStorage.getItem('nagar-mitra-user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          // Verify user still exists in database
          const { data, error } = await supabase
            .from('users')
            .select('id, name, phone_number, email, profile_picture_url')
            .eq('id', userData.id)
            .single()
          
          if (data && !error) {
            setUser(data)
          } else {
            localStorage.removeItem('nagar-mitra-user')
          }
        } catch (error) {
          localStorage.removeItem('nagar-mitra-user')
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [])

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signUpUser(data)
      
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem('nagar-mitra-user', JSON.stringify(result.user))
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signIn = async (phoneNumber: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInUser(phoneNumber, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem('nagar-mitra-user', JSON.stringify(result.user))
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('nagar-mitra-user')
  }

  const updateProfilePicture = async (profilePictureUrl: string | null): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const result = await updateProfilePictureAction(user.id, profilePictureUrl)
      
      if (result.success && result.user) {
        setUser(result.user)
        localStorage.setItem('nagar-mitra-user', JSON.stringify(result.user))
        return { success: true }
      }
      
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Profile picture update error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfilePicture,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}