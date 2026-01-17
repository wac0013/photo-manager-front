import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { Plus, FolderOpen, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@tanstack/react-router'
import { TruncatedText } from '@/components/ui/truncated-text'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAlbums, useCreateAlbum, useDeleteAlbum } from '@/hooks/use-albums'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardComponent,
})

function DashboardComponent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useAlbums()
  const createAlbumMutation = useCreateAlbum()
  const deleteAlbumMutation = useDeleteAlbum()

  const albums = data?.pages.flatMap(page => page.data) ?? []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleCreateAlbum = useCallback(async () => {
    if (!title.trim()) {
      toast.error('O título é obrigatório')
      return
    }

    try {
      await createAlbumMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      toast.success('Álbum criado com sucesso!')
      setIsCreateDialogOpen(false)
      setTitle('')
      setDescription('')
    } catch (error) {
      toast.error('Erro ao criar álbum. Tente novamente.')
    }
  }, [title, description, createAlbumMutation])

  const handleDeleteAlbum = useCallback(async (id: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(id)
      toast.success('Álbum excluído com sucesso!')
      setDeleteAlbumId(null)
    } catch (error) {
      toast.error('Erro ao excluir álbum. Tente novamente.')
    }
  }, [deleteAlbumMutation])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Meus álbuns de fotos</h1>
          <p className="text-muted-foreground">Gerencie suas coleções e memórias.</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6 shadow-md hover:shadow-xl hover:scale-105 transition-all gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Criar novo álbum
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl border border-white/5 shadow-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Criar novo álbum</DialogTitle>
              <DialogDescription>
                Dê um título e uma descrição para o seu novo álbum.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold ml-1 text-muted-foreground">Título *</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Viagem de Verão" 
                  className="rounded-xl h-11 bg-muted/50 border-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold ml-1 text-muted-foreground">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Sobre o que é este álbum?" 
                  className="rounded-xl min-h-[100px] bg-muted/50 border-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full rounded-xl h-11 shadow-lg shadow-primary/20 font-bold"
                onClick={handleCreateAlbum}
                disabled={createAlbumMutation.isPending}
              >
                {createAlbumMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Concluir'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-destructive font-medium">Erro ao carregar álbuns</p>
          <p className="text-muted-foreground text-sm mt-1">Tente novamente mais tarde</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">Nenhum álbum encontrado</p>
          <p className="text-muted-foreground text-sm mt-1">Crie seu primeiro álbum para começar</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {albums.map((album) => (
              <div key={album.id} className="group relative">
                <Link 
                  to="/album/$albumId" 
                  params={{ albumId: album.id }}
                  className="block h-full"
                >
                  <Card className="glass-card border-none hover:ring-4 ring-primary/20 transition-all duration-300 cursor-pointer overflow-hidden rounded-4xl shadow-sm hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col min-w-0 p-0">
                    {album.coverPhoto ? (
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <img 
                          src={album.coverPhoto} 
                          alt={album.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden bg-muted/30">
                        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-50" />
                        <FolderOpen className="w-12 h-12 text-primary/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <CardHeader className="p-5 flex-1 flex flex-col min-w-0 w-full overflow-hidden">
                      <TruncatedText 
                        text={album.title} 
                        className="text-lg font-bold group-hover:text-primary transition-colors duration-300 w-full"
                      />
                      
                      <TruncatedText 
                        text={album.description || 'Sem descrição'} 
                        lines={2}
                        className="text-sm leading-relaxed mt-1 text-muted-foreground w-full"
                        side="bottom"
                      />
                    </CardHeader>
                  </Card>
                </Link>

                {album.hasImages || album.coverPhoto ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-50 transition-opacity shadow-lg shadow-destructive/20 cursor-not-allowed"
                        disabled
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Remova as imagens antes de excluir o álbum
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <ConfirmDialog
                    title="Excluir álbum"
                    description="Deseja mesmo excluir este álbum? Esta ação não pode ser desfeita."
                    confirmText="Excluir"
                    variant="destructive"
                    open={deleteAlbumId === album.id}
                    onOpenChange={(open) => !open && setDeleteAlbumId(null)}
                    onConfirm={() => handleDeleteAlbum(album.id)}
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-destructive/20"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDeleteAlbumId(album.id)
                      }}
                      disabled={deleteAlbumMutation.isPending}
                    >
                      {deleteAlbumMutation.isPending && deleteAlbumId === album.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </ConfirmDialog>
                )}
              </div>
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Carregando mais álbuns...</span>
              </div>
            )}
            {!hasNextPage && albums.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Você chegou ao fim da lista
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
