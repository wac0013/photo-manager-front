import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAlbumDetail } from './album-detail.hooks';
import { AlbumDetailHeader } from './album-detail-header';
import { PhotoGrid } from './photo-grid';
import { PhotoTable } from './photo-table';
import { PhotoViewerDialog } from './photo-dialog';
import type { AlbumDetailProps } from './album-detail.types';

export function AlbumDetailView({ albumId }: AlbumDetailProps) {
  const {
    album,
    isLoadingAlbum,
    photos,
    isLoadingPhotos,
    isFetchingNextPage,
    view,
    setView,
    selectedPhoto,
    setSelectedPhoto,
    isDragging,
    setIsDragging,
    photoDate,
    setPhotoDate,
    isDeleteAlbumOpen,
    setIsDeleteAlbumOpen,
    isDeletePhotoOpen,
    setIsDeletePhotoOpen,
    selectedFile,
    isDialogOpen,
    photoColor,
    setPhotoColor,
    photoTitle,
    setPhotoTitle,
    photoDescription,
    setPhotoDescription,
    fileInputRef,
    loadMoreRef,
    handleDeleteAlbum,
    handleDeletePhoto,
    handleDialogClose,
    handleFileChange,
    handleDrop,
    handleSubmit,
    isCreatingPhoto,
  } = useAlbumDetail(albumId);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <AlbumDetailHeader 
        album={album}
        isLoadingAlbum={isLoadingAlbum}
        view={view}
        setView={setView}
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
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

      {isLoadingPhotos ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : view === 'grid' ? (
        <PhotoGrid 
          photos={photos}
          setSelectedPhoto={setSelectedPhoto}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : (
        <PhotoTable 
          photos={photos}
          setSelectedPhoto={setSelectedPhoto}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
        />
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

      <PhotoViewerDialog 
        selectedPhoto={selectedPhoto}
        setSelectedPhoto={setSelectedPhoto}
        isDeletePhotoOpen={isDeletePhotoOpen}
        setIsDeletePhotoOpen={setIsDeletePhotoOpen}
        handleDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
}
