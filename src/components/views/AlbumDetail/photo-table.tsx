import { Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Photo } from '@/types/album';
import { TruncatedText } from '@/components/ui/truncated-text';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PhotoTableProps {
  photos: Photo[];
  setSelectedPhoto: (photo: Photo) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
}

export function PhotoTable({
  photos,
  setSelectedPhoto,
  loadMoreRef,
  isFetchingNextPage,
}: PhotoTableProps) {
  return (
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
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
      </div>
    </div>
  );
}
