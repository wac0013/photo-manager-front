import { FolderOpen, Loader2 } from 'lucide-react';
import { useDashboard } from './dashboard.hooks';
import { DashboardHeader } from './dashboard-header';
import { AlbumCard } from './album-card';

export function DashboardView() {
  const {
    albums,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    deleteAlbumId,
    setDeleteAlbumId,
    title,
    setTitle,
    description,
    setDescription,
    loadMoreRef,
    handleCreateAlbum,
    handleDeleteAlbum,
    isCreatingAlbum,
    isDeletingAlbum,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-destructive font-medium">Erro ao carregar álbuns</p>
        <p className="text-muted-foreground text-sm mt-1">Tente novamente mais tarde</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeader 
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        handleCreateAlbum={handleCreateAlbum}
        isCreatingAlbum={isCreatingAlbum}
      />

      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">Nenhum álbum encontrado</p>
          <p className="text-muted-foreground text-sm mt-1">Crie seu primeiro álbum para começar</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {albums.map((album) => (
              <AlbumCard 
                key={album.id}
                album={album}
                deleteAlbumId={deleteAlbumId}
                setDeleteAlbumId={setDeleteAlbumId}
                handleDeleteAlbum={handleDeleteAlbum}
                isDeletingAlbum={isDeletingAlbum}
              />
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
  );
}
