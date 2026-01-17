import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useState, useRef, useEffect, useCallback } from 'react'
import { LayoutGrid, Table as TableIcon, Plus, Trash2, ArrowLeft, Image as ImageIcon, X, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@tanstack/react-router'
import { TruncatedText } from '@/components/ui/truncated-text'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAlbum, usePhotos, useDeleteAlbum, useCreatePhoto, useDeletePhoto } from '@/hooks/use-albums'
import { useNavigate } from '@tanstack/react-router'
import type { Photo } from '@/types/album'

export const albumDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/album/$albumId',
  component: AlbumDetailComponent,
})

interface SelectedFile {
  file: File
  preview: string
  name: string
  size: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function AlbumDetailComponent() {
  const { albumId } = albumDetailRoute.useParams()
  const navigate = useNavigate()
  
  const { data: album, isLoading: isLoadingAlbum } = useAlbum(albumId)
  const { 
    data: photosData, 
    isLoading: isLoadingPhotos, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePhotos(albumId)
  const deleteAlbumMutation = useDeleteAlbum()
  const createPhotoMutation = useCreatePhoto()
  const deletePhotoMutation = useDeletePhoto()

  const photos = photosData?.pages.flatMap(page => page.data) ?? []

  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [photoDate, setPhotoDate] = useState<Date | undefined>(new Date())
  const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false)
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [photoColor, setPhotoColor] = useState('#000000')
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoDescription, setPhotoDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [handleLoadMore])

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbumMutation.mutateAsync(albumId)
      toast.success("Álbum excluído com sucesso!")
      setIsDeleteAlbumOpen(false)
      navigate({ to: '/' })
    } catch (error) {
      toast.error("Erro ao excluir álbum. Tente novamente.")
    }
  }

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return
    
    try {
      await deletePhotoMutation.mutateAsync({ 
        photoId: selectedPhoto.id, 
        albumId 
      })
      toast.success("Foto excluída com sucesso!")
      setIsDeletePhotoOpen(false)
      setSelectedPhoto(null)
    } catch (error) {
      toast.error("Erro ao excluir foto. Tente novamente.")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  const validateFile = (file: File): File | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(`"${file.name}" não é uma imagem válida. Tipos aceitos: JPG, PNG, GIF, WebP`)
      return null
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`"${file.name}" excede o tamanho máximo de 10MB`)
      return null
    }
    return file
  }

  const setFile = (file: File) => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview)
    }
    setSelectedFile({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    })
  }

  const clearFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview)
    }
    setSelectedFile(null)
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      clearFile()
      setPhotoColor('#000000')
      setPhotoTitle('')
      setPhotoDescription('')
      setPhotoDate(new Date())
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    setIsDialogOpen(open)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const validFile = validateFile(files[0])
      if (validFile) {
        setFile(validFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const validFile = validateFile(files[0])
      if (validFile) {
        setFile(validFile)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma foto para enviar")
      return
    }

    if (!photoTitle.trim()) {
      toast.error("O título é obrigatório")
      return
    }
    
    try {
      await createPhotoMutation.mutateAsync({
        file: selectedFile.file,
        title: photoTitle.trim(),
        description: photoDescription.trim() || undefined,
        acquireAt: photoDate?.toISOString(),
        albumId,
        color: photoColor,
      })
      toast.success("Foto adicionada com sucesso!")
      handleDialogClose(false)
    } catch (error) {
      toast.error("Erro ao adicionar foto. Tente novamente.")
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors w-fit group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Voltar para Meus álbuns
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-0.5">
            {isLoadingAlbum ? (
              <>
                <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted/30 rounded animate-pulse mt-1" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-black tracking-tight text-foreground/90">{album?.title}</h1>
                <p className="text-muted-foreground text-sm">{album?.description || 'Sem descrição'}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/30 p-1 rounded-xl border backdrop-blur-sm">
              <Button 
                variant={view === 'table' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setView('table')}
                className="rounded-lg gap-1.5 h-8 px-3 text-xs"
              >
                <TableIcon className="w-3.5 h-3.5" />
                Tabela
              </Button>
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setView('grid')}
                className="rounded-lg gap-1.5 h-8 px-3 text-xs"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Miniaturas
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-6 h-10 shadow-md hover:shadow-primary/20 hover:scale-105 transition-all gap-2 bg-primary text-sm">
                  <Plus className="w-4 h-4" />
                  Adicionar fotos
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] rounded-3xl border border-white/5 shadow-3xl p-6 overflow-hidden flex flex-col">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">Adicionar novas fotos</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto grid gap-6 py-4 px-1">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer group relative overflow-hidden",
                      isDragging 
                        ? "border-primary bg-primary/10 scale-95" 
                        : "border-primary/20 bg-muted/40 hover:border-primary/50 hover:bg-muted/60"
                    )}
                  >
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    
                    {selectedFile ? (
                      <div className="relative w-full animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted/30 shadow-lg">
                          <img 
                            src={selectedFile.preview} 
                            alt={selectedFile.name}
                            className="w-full h-full object-contain"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              clearFile()
                            }}
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold truncate px-4">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{selectedFile.size}</p>
                          <p className="text-[10px] text-primary/70 mt-1">Clique para trocar a imagem</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={cn(
                          "bg-primary/10 p-3 rounded-full transition-all duration-500",
                          isDragging ? "scale-110 bg-primary/20" : "group-hover:scale-110"
                        )}>
                          <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <p className="mt-3 font-bold text-sm">Escolher imagem...</p>
                        <p className="text-xs text-muted-foreground mt-1 text-center">Arraste ou clique para selecionar</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">JPG, PNG, GIF, WebP • Máx. 10MB</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="photo-title" className="text-xs font-semibold ml-1 text-muted-foreground">Título *</Label>
                      <Input 
                        id="photo-title" 
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="Digite o título da foto"
                        className="rounded-lg h-10 bg-muted/40 border border-border/50 text-sm focus-visible:ring-offset-0" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="photo-desc" className="text-xs font-semibold ml-1 text-muted-foreground">Descrição</Label>
                      <Textarea 
                        id="photo-desc" 
                        value={photoDescription}
                        onChange={(e) => setPhotoDescription(e.target.value)}
                        placeholder="Digite uma descrição (opcional)"
                        className="rounded-lg bg-muted/40 border border-border/50 min-h-[80px] text-sm resize-none focus-visible:ring-offset-0" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="photo-date" className="text-xs font-semibold ml-1 text-muted-foreground">Data/Hora</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal rounded-lg h-10 bg-muted/40 border-border/50 hover:bg-muted/60 px-3 text-xs focus-visible:ring-offset-0"
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              {photoDate ? format(photoDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-border bg-card" align="start">
                            <Calendar
                              mode="single"
                              selected={photoDate}
                              onSelect={setPhotoDate}
                              locale={ptBR}
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={new Date().getFullYear() + 20}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="photo-color" className="text-xs font-semibold ml-1 text-muted-foreground">Cor predominante</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="photo-color" 
                            type="color" 
                            value={photoColor}
                            onChange={(e) => setPhotoColor(e.target.value)}
                            className="w-10 h-10 p-1 rounded-lg bg-muted/40 border border-border/50 cursor-pointer" 
                          />
                          <Input 
                            value={photoColor}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
                                setPhotoColor(value.startsWith('#') ? value : `#${value}`)
                              }
                            }}
                            placeholder="#000000" 
                            className="rounded-lg h-10 bg-muted/40 border border-border/50 flex-1 text-xs font-mono focus-visible:ring-offset-0" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-border/50">
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl h-11 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={!selectedFile || !photoTitle.trim() || createPhotoMutation.isPending}
                  >
                    {createPhotoMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : !selectedFile ? (
                      'Selecione uma imagem para enviar'
                    ) : !photoTitle.trim() ? (
                      'Digite um título'
                    ) : (
                      'Adicionar foto'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {isLoadingPhotos ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-muted/30 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:ring-3 ring-primary/20"
            >
              {photo.url ? (
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-all duration-700">
                  <ImageIcon className="w-12 h-12 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-4 left-4 right-4 text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 min-w-0">
                <TruncatedText 
                  text={photo.title} 
                  className="font-bold text-base leading-tight"
                />
                {photo.sizeFormatted && (
                  <span className="text-[10px] text-white/70 font-medium mt-0.5 block">
                    {photo.sizeFormatted}
                  </span>
                )}
              </div>
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">Nenhuma foto neste álbum</p>
              <p className="text-xs mt-1">Adicione fotos clicando no botão acima</p>
            </div>
          )}
          <div ref={loadMoreRef} className="col-span-full flex justify-center py-4">
            {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-none overflow-hidden bg-card shadow-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-6 py-4 font-bold w-[30%]">Foto</th>
                <th className="px-6 py-4 font-bold w-[20%]">Descrição</th>
                <th className="px-6 py-4 font-bold w-[15%]">Tamanho</th>
                <th className="px-6 py-4 font-bold w-[20%]">Data de aquisição</th>
                <th className="px-6 py-4 font-bold w-[15%]">Cor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {photos.map((photo) => (
                <tr 
                  key={photo.id} 
                  onClick={() => setSelectedPhoto(photo)}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-bold text-sm group-hover:text-primary transition-colors overflow-hidden">
                    <TruncatedText text={photo.title} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium truncate">{photo.description || '-'}</td>
                  <td className="px-6 py-4 text-muted-foreground font-medium truncate">
                    {photo.sizeFormatted || '-'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium truncate">
                    {photo.acquireAt ? format(new Date(photo.acquireAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shadow border-2 border-background shrink-0" style={{ backgroundColor: photo.color }} />
                      <span className="font-mono font-bold text-muted-foreground truncate" style={{ color: photo.color }}>{photo.color}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {photos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma foto neste álbum</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div ref={view === 'table' ? loadMoreRef : undefined} className="flex justify-center py-4">
            {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
          </div>
        </div>
      )}

      <div className="flex justify-start">
        {photos.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-not-allowed">
                <Button 
                  variant="destructive" 
                  disabled
                  className="rounded-xl px-6 h-10 text-sm font-bold gap-2 opacity-50 pointer-events-none"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir álbum
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              Apenas álbuns vazios podem ser excluídos.
            </TooltipContent>
          </Tooltip>
        ) : (
          <ConfirmDialog
            title="Excluir álbum"
            description="Tem certeza que deseja excluir este álbum? Esta ação não pode ser desfeita."
            confirmText="Excluir Álbum"
            variant="destructive"
            open={isDeleteAlbumOpen}
            onOpenChange={setIsDeleteAlbumOpen}
            onConfirm={handleDeleteAlbum}
          >
            <Button variant="destructive" className="rounded-xl px-6 h-10 text-sm font-bold gap-2 shadow-md shadow-destructive/10 hover:scale-105 transition-all">
              <Trash2 className="w-4 h-4" />
              Excluir álbum
            </Button>
          </ConfirmDialog>
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-[95vw] md:max-w-[1200px] h-[90vh] p-0 rounded-[2rem] overflow-hidden border-none shadow-3xl bg-black/95">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-6 left-8 z-10 animate-in fade-in slide-in-from-left-4 duration-500 delay-200 max-w-[70%]">
              <TruncatedText 
                text={selectedPhoto?.title || ''} 
                className="text-lg font-black text-white/90 drop-shadow-lg"
                side="bottom"
              />
              <div className="h-1 w-6 bg-primary/80 rounded-full mt-1" />
            </div>
            
            <Button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-8 z-10 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/70 hover:text-white p-2 rounded-full transition-all hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-transparent via-transparent to-black/60">
              {selectedPhoto?.url ? (
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-muted/5 flex items-center justify-center relative overflow-hidden group">
                  <ImageIcon className="w-12 h-12 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-8 right-8 z-10 flex items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="max-w-lg bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl">
                <TruncatedText 
                  text={selectedPhoto?.description || 'Sem descrição'} 
                  lines={3}
                  className="text-sm text-white/80 font-medium leading-relaxed"
                  side="top"
                />
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">Tamanho</span>
                    <span className="text-white/70 font-bold text-[10px]">
                      {selectedPhoto?.sizeFormatted || '-'}
                    </span>
                  </div>
                  <div className="w-px h-5 bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">Data</span>
                    <span className="text-white/70 font-bold text-[10px]">
                      {selectedPhoto?.acquireAt 
                        ? format(new Date(selectedPhoto.acquireAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) 
                        : 'Não informada'}
                    </span>
                  </div>
                  <div className="w-px h-5 bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">Cor Base</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full opacity-60" style={{ backgroundColor: selectedPhoto?.color }} />
                      <span className="text-white/70 font-mono font-bold text-[10px]">{selectedPhoto?.color}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <ConfirmDialog
                title="Excluir foto"
                description="Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita."
                confirmText="Excluir Foto"
                variant="destructive"
                open={isDeletePhotoOpen}
                onOpenChange={setIsDeletePhotoOpen}
                onConfirm={handleDeletePhoto}
              >
                <button className="bg-destructive/10 hover:bg-destructive/20 text-destructive/80 hover:text-destructive px-4 h-9 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all border border-destructive/20">
                  Excluir Foto
                </button>
              </ConfirmDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
