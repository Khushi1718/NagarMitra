'use server'

import { createClient } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

interface SignUpData {
  name: string
  phoneNumber: string
  email: string
  password: string
}

interface AuthResult {
  success: boolean
  error?: string
  user?: {
    id: string
    name: string
    phone_number: string
    email: string
    profile_picture_url?: string
  }
}

// Simple password hashing using built-in crypto
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.PASSWORD_SALT || 'default-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function signUpUser(data: SignUpData): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    // Check if phone number or email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('phone_number, email')
      .or(`phone_number.eq.${data.phoneNumber},email.eq.${data.email}`)
      .single()

    if (existingUser) {
      if (existingUser.phone_number === data.phoneNumber) {
        return { success: false, error: 'Phone number already registered' }
      }
      if (existingUser.email === data.email) {
        return { success: false, error: 'Email already registered' }
      }
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name: data.name,
          phone_number: data.phoneNumber,
          email: data.email,
          password_hash: passwordHash,
        },
      ])
      .select('id, name, phone_number, email, profile_picture_url')
      .single()

    if (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'Failed to create account. Please try again.' }
    }

    if (newUser) {
      return { success: true, user: newUser }
    }

    return { success: false, error: 'Failed to create account' }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signInUser(phoneNumber: string, password: string): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    // Find user by phone number
    const { data: userData, error } = await supabase
      .from('users')
      .select('id, name, phone_number, email, password_hash, profile_picture_url')
      .eq('phone_number', phoneNumber)
      .single()

    if (error || !userData) {
      return { success: false, error: 'Invalid phone number or password' }
    }

    // Verify password
    const hashedPassword = await hashPassword(password)
    
    if (hashedPassword !== userData.password_hash) {
      return { success: false, error: 'Invalid phone number or password' }
    }

    // Return user data (without password hash)
    const userWithoutPassword = {
      id: userData.id,
      name: userData.name,
      phone_number: userData.phone_number,
      email: userData.email,
      profile_picture_url: userData.profile_picture_url,
    }

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateProfilePicture(userId: string, profilePictureUrl: string | null): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ profile_picture_url: profilePictureUrl })
      .eq('id', userId)
      .select('id, name, phone_number, email, profile_picture_url')
      .single()

    if (error) {
      console.error('Profile picture update error:', error)
      return { success: false, error: 'Failed to update profile picture' }
    }

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Profile picture update error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}