import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { LoginView } from '@/components/views/Login/login'

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginView,
})
