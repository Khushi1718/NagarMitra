'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface OnboardingContextType {
  showOnboarding: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_KEY = 'nagar-mitra-onboarding-completed'

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem(ONBOARDING_KEY)
    setShowOnboarding(!onboardingCompleted)
    setIsLoaded(true)
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    setShowOnboarding(true)
  }

  const value = {
    showOnboarding: showOnboarding && isLoaded,
    completeOnboarding,
    resetOnboarding,
  }

  // Don't render children until we've loaded the onboarding state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}