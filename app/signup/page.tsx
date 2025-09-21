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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const { resetOnboarding } = useOnboarding()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Special handling for phone number to prevent unwanted formatting
    if (name === 'phoneNumber') {
      // Remove any non-digit characters except + and spaces/dashes for international numbers
      const cleanedValue = value.replace(/[^\d+\s-]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      return 'Please enter your full name'
    }
    if (formData.name.trim().length < 2) {
      return 'Name must be at least 2 characters long'
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      return 'Please enter your phone number'
    }
    // Remove spaces and dashes for validation, but keep the original format
    const cleanPhoneForValidation = formData.phoneNumber.replace(/[\s-]/g, '')
    const phoneRegex = /^[+]?[\d]{10,15}$/
    if (!phoneRegex.test(cleanPhoneForValidation)) {
      return 'Please enter a valid phone number (10-15 digits)'
    }

    // Email validation
    if (!formData.email.trim()) {
      return 'Please enter your email address'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      return 'Please enter a password'
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const result = await signUp({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      
      if (result.success) {
        router.push('/') // Redirect to home page after successful signup
      } else {
        setError(result.error || 'Sign up failed')
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
            <LoginCardTitle className="text-center">Create your account</LoginCardTitle>
            <LoginCardDescription className="text-center">
              Join Nagar Mitra to get started with community services
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number (e.g., +91 9876543210)"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </AuthButton>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link 
                  href="/login" 
                  className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </LoginCardFooter>
          </form>
        </LoginCard>
      </div>
    </div>
  )
}