'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { LanguageSelector, type Language } from '@/components/LanguageSelectorNew';
import { useAuth } from '@/contexts/AuthContext';
import { profilePictureUploader } from '@/lib/profile-picture-uploader';
import { Camera, Upload, Trash2 } from 'lucide-react';

export default function Settings() {
  const { user, signOut, updateProfilePicture } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
      router.push('/login');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadResult = await profilePictureUploader.uploadProfilePicture(file, user.id);
      
      if (uploadResult.success && uploadResult.url) {
        const updateResult = await updateProfilePicture(uploadResult.url);
        if (!updateResult.success) {
          setUploadError(updateResult.error || 'Failed to update profile');
        }
      } else {
        setUploadError(uploadResult.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('An unexpected error occurred');
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user || !confirm('Are you sure you want to remove your profile picture?')) return;

    setUploading(true);
    setUploadError('');

    try {
      // Delete from storage
      await profilePictureUploader.deleteProfilePicture(user.id);
      
      // Update database
      const updateResult = await updateProfilePicture(null);
      if (!updateResult.success) {
        setUploadError(updateResult.error || 'Failed to remove profile picture');
      }
    } catch (error) {
      setUploadError('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null; // This shouldn't happen due to AuthWrapper, but just in case
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile & Settings</h1>
        
        <div className="space-y-4">
          {/* Profile Picture Section */}
          <div className="bg-card rounded-lg p-4 border text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              {user.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
              
              {/* Upload/Change button */}
              <button
                onClick={handleFileSelect}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>

            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">Active Citizen</p>

            {/* Profile picture actions */}
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={handleFileSelect}
                disabled={uploading}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                <Upload className="w-3 h-3" />
                {user.profile_picture_url ? 'Change' : 'Upload'}
              </button>
              
              {user.profile_picture_url && (
                <button
                  onClick={handleRemoveProfilePicture}
                  disabled={uploading}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 mt-2">{uploadError}</p>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Profile Details */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Profile Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Name</span>
                <span className="text-sm text-muted-foreground">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone</span>
                <span className="text-sm text-muted-foreground">{user.phone_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">Your Impact</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Issues Reported</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-muted-foreground">Issues Resolved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">156</div>
                <div className="text-xs text-muted-foreground">Community Points</div>
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Updates</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Location Services</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <LanguageSelector onLanguageChange={(language: Language) => {
                console.log('Language changed to:', language);
              }} />
            </div>
          </div>

          {/* App Information */}
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">App Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Privacy Policy</span>
                <span className="text-sm text-primary">View →</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Terms of Service</span>
                <span className="text-sm text-primary">View →</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Help & Support</span>
                <span className="text-sm text-primary">Contact →</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-md text-sm font-medium mt-6 hover:bg-destructive/90 transition-colors"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}