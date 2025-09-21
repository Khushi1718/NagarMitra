'use client'

import { createClient } from '@/lib/supabase/client-browser'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export class ProfilePictureUploader {
  private supabase = createClient()
  private readonly maxSize = 5 * 1024 * 1024 // 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
    }

    return { valid: true }
  }

  async uploadProfilePicture(file: File, userId: string): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      // Delete existing profile picture for this user (cleanup)
      await this.deleteExistingProfilePicture(userId)

      // Upload new file
      const { data, error } = await this.supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: 'Failed to upload image' }
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('profile-pictures')
        .getPublicUrl(data.path)

      return { success: true, url: urlData.publicUrl }
    } catch (error) {
      console.error('Profile picture upload error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  async deleteExistingProfilePicture(userId: string): Promise<void> {
    try {
      // List files for this user
      const { data: files, error } = await this.supabase.storage
        .from('profile-pictures')
        .list(userId)

      if (error || !files) {
        return // No existing files or error listing
      }

      // Delete all existing files for this user
      if (files.length > 0) {
        const filePaths = files.map(file => `${userId}/${file.name}`)
        await this.supabase.storage
          .from('profile-pictures')
          .remove(filePaths)
      }
    } catch (error) {
      console.error('Error deleting existing profile picture:', error)
      // Don't throw, as this is cleanup
    }
  }

  async deleteProfilePicture(userId: string): Promise<UploadResult> {
    try {
      await this.deleteExistingProfilePicture(userId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      return { success: false, error: 'Failed to delete profile picture' }
    }
  }
}

// Create a singleton instance
export const profilePictureUploader = new ProfilePictureUploader()