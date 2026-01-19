import { Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Photo } from '@/types/album';
import { TruncatedText } from '@/components/ui/truncated-text';

interface PhotoGridProps {
  photos: Photo[];
  setSelectedPhoto: (photo: Photo) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
}

export function PhotoGrid({
  photos,
  setSelectedPhoto,
  loadMoreRef,
  isFetchingNextPage,
}: PhotoGridProps) {
  return (
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
  );
}
