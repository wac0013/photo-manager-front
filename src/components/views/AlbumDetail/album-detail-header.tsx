import { ArrowLeft, LayoutGrid, Table as TableIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import type { ViewType } from './album-detail.types';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AddPhotoDialog } from './add-photo-dialog';
import type { Album } from '@/types/album';

interface AlbumDetailHeaderProps {
  album?: Album;
  isLoadingAlbum: boolean;
  view: ViewType;
  setView: (view: ViewType) => void;
  isDialogOpen: boolean;
  handleDialogClose: (open: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: any;
  photoTitle: string;
  setPhotoTitle: (title: string) => void;
  photoDescription: string;
  setPhotoDescription: (desc: string) => void;
  photoDate: Date | undefined;
  setPhotoDate: (date: Date | undefined) => void;
  photoColor: string;
  setPhotoColor: (color: string) => void;
  handleSubmit: () => Promise<void>;
  isCreatingPhoto: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export function AlbumDetailHeader({
  album,
  isLoadingAlbum,
  view,
  setView,
  isDialogOpen,
  handleDialogClose,
  fileInputRef,
  handleDrop,
  handleFileChange,
  selectedFile,
  photoTitle,
  setPhotoTitle,
  photoDescription,
  setPhotoDescription,
  photoDate,
  setPhotoDate,
  photoColor,
  setPhotoColor,
  handleSubmit,
  isCreatingPhoto,
  isDragging,
  setIsDragging,
}: AlbumDetailHeaderProps) {
  return (
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
            <AddPhotoDialog 
              fileInputRef={fileInputRef}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              selectedFile={selectedFile}
              photoTitle={photoTitle}
              setPhotoTitle={setPhotoTitle}
              photoDescription={photoDescription}
              setPhotoDescription={setPhotoDescription}
              photoDate={photoDate}
              setPhotoDate={setPhotoDate}
              photoColor={photoColor}
              setPhotoColor={setPhotoColor}
              handleSubmit={handleSubmit}
              isCreatingPhoto={isCreatingPhoto}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </Dialog>
        </div>
      </div>
    </div>
  );
}
