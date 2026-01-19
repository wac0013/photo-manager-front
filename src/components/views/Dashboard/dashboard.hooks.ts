import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAlbums, useCreateAlbum, useDeleteAlbum } from '@/hooks/use-albums';

export function useDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useAlbums();
  const createAlbumMutation = useCreateAlbum();
  const deleteAlbumMutation = useDeleteAlbum();

  const albums = data?.pages.flatMap(page => page.data) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreateAlbum = useCallback(async () => {
    if (!title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    try {
      await createAlbumMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      toast.success('Álbum criado com sucesso!');
      setIsCreateDialogOpen(false);
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Erro ao criar álbum. Tente novamente.');
    }
  }, [title, description, createAlbumMutation]);

  const handleDeleteAlbum = useCallback(async (id: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(id);
      toast.success('Álbum excluído com sucesso!');
      setDeleteAlbumId(null);
    } catch (error) {
      toast.error('Erro ao excluir álbum. Tente novamente.');
    }
  }, [deleteAlbumMutation]);

  return {
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
    isCreatingAlbum: createAlbumMutation.isPending,
    isDeletingAlbum: deleteAlbumMutation.isPending,
  };
}
