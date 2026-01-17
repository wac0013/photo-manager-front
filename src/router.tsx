import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { loginRoute } from './routes/login'
import { registerRoute } from './routes/register'
import { albumDetailRoute } from './routes/album'
import { forgotPasswordRoute } from './routes/forgot-password'
import { resetPasswordRoute } from './routes/reset-password'

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  albumDetailRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
