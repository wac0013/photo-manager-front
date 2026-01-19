import { createRootRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { MainLayout } from '@/components/layout/MainLayout/main'


const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

export const rootRoute = createRootRoute({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession()
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname)

    if (isPublicRoute && session) {
      throw redirect({ to: '/' })
    }

    if (!isPublicRoute && !session) {
      throw redirect({ to: '/login' })
    }

    return { session }
  },
  component: MainLayout,
})
