import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { DashboardView } from '@/components/views/Dashboard/dashboard'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardView,
})
