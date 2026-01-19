import { createRoute, useSearch } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { ResetPasswordView } from '@/components/views/ResetPassword/reset-password'
import type { ResetPasswordSearch } from '@/components/views/ResetPassword/reset-password.types'

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => {
    return {
      token: search.token as string | undefined,
    }
  },
  component: ResetPasswordPageComponent,
})

function ResetPasswordPageComponent() {
  const { token } = useSearch({ from: '/reset-password' })
  return <ResetPasswordView token={token} />
}
