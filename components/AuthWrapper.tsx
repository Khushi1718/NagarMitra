'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { InteractiveMenu } from '@/components/ui/modern-mobile-menu'
import { WelcomeScreen } from '@/components/onboarding-screen'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const { showOnboarding, completeOnboarding } = useOnboarding()
  const router = useRouter()
  const pathname = usePathname()

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        // User is not authenticated and trying to access a protected route
        router.push('/login')
      } else if (user && isPublicRoute) {
        // User is authenticated and trying to access login/signup page
        router.push('/')
      }
    }
  }, [user, loading, isPublicRoute, router])

  // Show onboarding screen for first-time users only when they're on login/signup pages
  if (showOnboarding && !user && isPublicRoute) {
    return (
      <div className="relative mx-auto h-screen w-full overflow-hidden">
        <WelcomeScreen
          imageUrl="https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          title={
            <>
              Welcome To Nagar Mitra
            </>
          }
          description="Your smart city companion. Report civic issues, connect with your community, and help build a better neighborhood together."
          buttonText="Let's get started"
          onButtonClick={() => {
            completeOnboarding()
            router.push('/signup')
          }}
          secondaryActionText={
            <>
              Already registered? <span className="font-semibold text-gray-900 dark:text-gray-100">Sign In</span>
            </>
          }
          onSecondaryActionClick={() => {
            completeOnboarding()
            router.push('/login')
          }}
        />
      </div>
    )
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // For public routes (login/signup), render without header and mobile menu
  if (isPublicRoute) {
    return (
      <div className="app-container">
        <main className="main-content">
          {children}
        </main>
      </div>
    )
  }

  // For protected routes, render with mobile menu only
  if (user) {
    return (
      <div className="app-container">
        <main className="main-content">
          {children}
        </main>
        <div className="mobile-menu-container">
          <InteractiveMenu />
        </div>
      </div>
    )
  }

  // This case should not happen due to the useEffect redirect, but just in case
  return null
}