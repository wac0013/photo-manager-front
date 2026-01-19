import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { AlbumDetailView } from '@/components/views/AlbumDetail/album-detail'

export const albumDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/album/$albumId',
  component: AlbumDetailPageComponent,
})

function AlbumDetailPageComponent() {
  const { albumId } = albumDetailRoute.useParams()
  return <AlbumDetailView albumId={albumId} />
}
