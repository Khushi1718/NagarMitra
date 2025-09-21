'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.phone_number}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}