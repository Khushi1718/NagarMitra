'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/ui/auth-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  LoginCard,
  LoginCardContent,
  LoginCardDescription,
  LoginCardFooter,
  LoginCardHeader,
  LoginCardTitle,
} from '@/components/ui/login-1'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const { resetOnboarding } = useOnboarding()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      setLoading(false)
      return
    }

    // Phone number validation (basic format)
    const cleanPhoneForValidation = phoneNumber.replace(/[\s-]/g, '')
    const phoneRegex = /^[+]?[\d]{10,15}$/
    if (!phoneRegex.test(cleanPhoneForValidation)) {
      setError('Please enter a valid phone number')
      setLoading(false)
      return
    }

    try {
      const result = await signIn(phoneNumber.trim(), password)
      
      if (result.success) {
        router.push('/') // Redirect to home page after successful login
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetOnboarding()
              // Small delay to allow state to update
              setTimeout(() => {
                window.location.reload()
              }, 100)
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Welcome
          </Button>
        </div>
        
        <LoginCard>
          <LoginCardHeader className="space-y-1">
            <LoginCardTitle className="text-center">Welcome back</LoginCardTitle>
            <LoginCardDescription className="text-center">
              Sign in to your Nagar Mitra account
            </LoginCardDescription>
          </LoginCardHeader>
          <form onSubmit={handleSubmit}>
            <LoginCardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Clean phone number input to prevent unwanted formatting
                    const cleanedValue = e.target.value.replace(/[^\d+\s-]/g, '')
                    setPhoneNumber(cleanedValue)
                  }}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </LoginCardContent>
            
            <LoginCardFooter className="flex flex-col space-y-4">
              <AuthButton 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </AuthButton>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link 
                  href="/signup" 
                  className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </LoginCardFooter>
          </form>
        </LoginCard>
      </div>
    </div>
  )
}