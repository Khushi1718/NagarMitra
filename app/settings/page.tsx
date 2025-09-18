'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    address: 'Sector 15, Noida, UP'
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile & Settings</h1>
        
        <div className="space-y-4">
          {/* Profile Picture Section */}
          <div className="bg-card rounded-lg p-4 border text-center">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="font-semibold text-lg">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">Active Citizen</p>
          </div>

          {/* Profile Details */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Profile Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary text-sm font-medium"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Name</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-sm bg-background border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{profileData.name}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="text-sm bg-background border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{profileData.phone}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="text-sm bg-background border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{profileData.email}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Address</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className="text-sm bg-background border rounded px-2 py-1"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{profileData.address}</span>
                )}
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
                <div className="text-2xl font-bold text-blue-600">156</div>
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
          <button className="w-full bg-destructive text-destructive-foreground py-2 px-4 rounded-md text-sm font-medium mt-6">
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}