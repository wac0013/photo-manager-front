import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { RegisterView } from '@/components/views/Register/register'

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterView,
})
