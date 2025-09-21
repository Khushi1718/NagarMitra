import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Skip authentication check for public routes
  if (isPublicRoute) {
    return response
  }

  // For now, we'll handle authentication on the client side using the AuthContext
  // The middleware will just pass through requests and let the layout handle redirects
  // This is a simplified approach that works well with client-side authentication

  return response
}
