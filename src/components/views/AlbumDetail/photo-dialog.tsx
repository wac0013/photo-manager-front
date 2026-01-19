import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TruncatedText } from '@/components/ui/truncated-text';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Photo } from '@/types/album';

interface PhotoViewerDialogProps {
  selectedPhoto: Photo | null;
  setSelectedPhoto: (photo: Photo | null) => void;
  isDeletePhotoOpen: boolean;
  setIsDeletePhotoOpen: (open: boolean) => void;
  handleDeletePhoto: () => Promise<void>;
}

export function PhotoViewerDialog({
  selectedPhoto,
  setSelectedPhoto,
  isDeletePhotoOpen,
  setIsDeletePhotoOpen,
  handleDeletePhoto,
}: PhotoViewerDialogProps) {
  return (
    <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[1200px] h-[90vh] p-0 rounded-[2rem] overflow-hidden border-none shadow-3xl bg-black/95">
        <DialogTitle/>
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
  );
}
