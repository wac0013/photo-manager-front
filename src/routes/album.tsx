import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { useState, useRef } from 'react'
import { LayoutGrid, Table as TableIcon, Plus, Trash2, ArrowLeft, Image as ImageIcon, X, Calendar as CalendarIcon } from 'lucide-react'
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

const MOCK_PHOTOS = [
  { id: '1', name: 'fotografia_de_um_por_do_sol_maravilhoso_em_uma_praia_deserta_nas_maldivas_com_reflexos_cristalinos.jpg', size: '2.4MB', date: '12/01/2026 18:45', color: '#ff8c00', description: 'Uma captura impressionante do sol se pondo no horizonte, criando cores vibrantes no céu e reflexos dourados na água calma.' },
  { id: '2', name: 'retrato_de_familia_durante_o_evento_beneficente_anual_da_comunidade_local.png', size: '1.1MB', date: '14/03/2025 15:00', color: '#42fbcc', description: 'Momento de alegria compartilhado entre gerações durante um ensolarado domingo de atividades comunitárias.' },
]

export const albumDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/album/$albumId',
  component: AlbumDetailComponent,
})

function AlbumDetailComponent() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [selectedPhoto, setSelectedPhoto] = useState<typeof MOCK_PHOTOS[0] | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [photoDate, setPhotoDate] = useState<Date | undefined>(new Date())
  const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false)
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDeleteAlbum = () => {
    toast.success("Álbum excluído com sucesso!")
    setIsDeleteAlbumOpen(false)
  }

  const handleDeletePhoto = () => {
    toast.success("Foto excluída com sucesso!")
    setIsDeletePhotoOpen(false)
    setSelectedPhoto(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      console.debug('Arquivos dropados:', files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      console.debug('Arquivos selecionados:', files)
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
            <h1 className="text-2xl font-black tracking-tight text-foreground/90">Álbum de aniversário</h1>
            <p className="text-muted-foreground text-sm">Descrição do meu álbum</p>
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

            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full px-6 h-10 shadow-md hover:shadow-primary/20 hover:scale-105 transition-all gap-2 bg-primary text-sm">
                  <Plus className="w-4 h-4" />
                  Adicionar fotos
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] rounded-[2rem] border border-white/5 shadow-3xl p-6">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">Adicionar novas fotos</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "flex flex-col items-center justify-center border-2 border-dashed rounded-[1.5rem] p-8 transition-all cursor-pointer group relative overflow-hidden",
                      isDragging 
                        ? "border-primary bg-primary/10 scale-95" 
                        : "border-primary/20 bg-muted/40 hover:border-primary/50 hover:bg-muted/60"
                    )}
                  >
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <div className={cn(
                      "bg-primary/10 p-4 rounded-full transition-all duration-500",
                      isDragging ? "scale-110 bg-primary/20" : "group-hover:scale-110"
                    )}>
                      <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <p className="mt-4 font-bold text-base">Escolher arquivo...</p>
                    <p className="text-xs text-muted-foreground mt-1 text-center max-w-[180px]">Arraste ou clique para selecionar</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="photo-title" className="text-xs font-semibold ml-1 text-muted-foreground">Título</Label>
                      <Input id="photo-title" className="rounded-lg h-10 bg-muted/50 border-none text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="photo-desc" className="text-xs font-semibold ml-1 text-muted-foreground">Descrição</Label>
                      <Textarea id="photo-desc" className="rounded-lg bg-muted/50 border-none min-h-[80px] text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="photo-date" className="text-xs font-semibold ml-1 text-muted-foreground">Data/Hora</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal rounded-lg h-10 border-none bg-muted/50 hover:bg-muted/70 px-3 text-xs"
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
                          <Input id="photo-color" type="color" className="w-10 h-10 p-1 rounded-lg bg-muted/50 border-none cursor-pointer" />
                          <Input placeholder="#000000" className="rounded-lg h-10 bg-muted/50 border-none flex-1 text-xs font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl h-11 text-base font-bold shadow-lg shadow-primary/20"
                    onClick={() => toast.success("Foto adicionada com sucesso!")}
                  >
                    Enviar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {MOCK_PHOTOS.map((photo) => (
            <div 
              key={photo.id} 
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-muted/30 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:ring-3 ring-primary/20"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-all duration-700">
                <ImageIcon className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-4 left-4 right-4 text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 min-w-0">
                <TruncatedText 
                  text={photo.name} 
                  className="font-bold text-base leading-tight"
                />
                <TruncatedText 
                  text={photo.description} 
                  lines={1}
                  className="text-[10px] text-white/70 mt-0.5"
                  side="bottom"
                />
              </div>
            </div>
          ))}
          {[...Array(3)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-[1.5rem] border-2 border-dashed border-muted/30 flex items-center justify-center text-muted/30 group hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 cursor-pointer">
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border-none overflow-hidden bg-card shadow-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-6 py-4 font-bold w-[40%]">Foto</th>
                <th className="px-6 py-4 font-bold w-[20%]">Tamanho</th>
                <th className="px-6 py-4 font-bold w-[20%]">Data de aquisição</th>
                <th className="px-6 py-4 font-bold w-[20%]">Cor predominante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {MOCK_PHOTOS.map((photo) => (
                <tr 
                  key={photo.id} 
                  onClick={() => setSelectedPhoto(photo)}
                  className="hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-bold text-sm group-hover:text-primary transition-colors overflow-hidden">
                    <TruncatedText text={photo.name} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium truncate">{photo.size}</td>
                  <td className="px-6 py-4 text-muted-foreground font-medium truncate">{photo.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shadow border-2 border-background shrink-0" style={{ backgroundColor: photo.color }} />
                      <span className="font-mono font-bold text-muted-foreground truncate" style={{ color: photo.color }}>{photo.color}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-start">
        {MOCK_PHOTOS.length > 0 ? (
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
                text={selectedPhoto?.name || ''} 
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

            <div className="flex-1 flex items-center justify-center p-6 bg-linear-to-b from-transparent via-transparent to-black/60">
              <div className="w-full h-full rounded-xl bg-muted/5 flex items-center justify-center relative overflow-hidden group">
                <ImageIcon className="w-12 h-12 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            </div>

            <div className="absolute bottom-6 left-8 right-8 z-10 flex items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="max-w-lg bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl">
                <TruncatedText 
                  text={selectedPhoto?.description || ''} 
                  lines={3}
                  className="text-sm text-white/80 font-medium leading-relaxed"
                  side="top"
                />
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">Tamanho</span>
                    <span className="text-white/70 font-mono font-bold text-[10px]">{selectedPhoto?.size}</span>
                  </div>
                  <div className="w-px h-5 bg-white/5" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">Data</span>
                    <span className="text-white/70 font-bold text-[10px]">{selectedPhoto?.date}</span>
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
