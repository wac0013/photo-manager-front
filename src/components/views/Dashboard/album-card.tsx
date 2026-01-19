import { FolderOpen, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { TruncatedText } from '@/components/ui/truncated-text';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Album } from '@/types/album';

interface AlbumCardProps {
  album: Album;
  deleteAlbumId: string | null;
  setDeleteAlbumId: (id: string | null) => void;
  handleDeleteAlbum: (id: string) => Promise<void>;
  isDeletingAlbum: boolean;
}

export function AlbumCard({
  album,
  deleteAlbumId,
  setDeleteAlbumId,
  handleDeleteAlbum,
  isDeletingAlbum,
}: AlbumCardProps) {
  return (
    <div className="group relative">
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
              e.preventDefault();
              e.stopPropagation();
              setDeleteAlbumId(album.id);
            }}
            disabled={isDeletingAlbum}
          >
            {isDeletingAlbum && deleteAlbumId === album.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </ConfirmDialog>
      )}
    </div>
  );
}
