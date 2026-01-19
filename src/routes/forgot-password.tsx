import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { ForgotPasswordView } from '@/components/views/ForgotPassword/forgot-password'

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordView,
})
