import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAlbum, usePhotos, useDeleteAlbum, useCreatePhoto, useDeletePhoto } from '@/hooks/use-albums';
import type { Photo } from '@/types/album';
import type { SelectedFile, ViewType } from './album-detail.types';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function useAlbumDetail(albumId: string) {
  const navigate = useNavigate();

  const { data: album, isLoading: isLoadingAlbum } = useAlbum(albumId);
  const {
    data: photosData,
    isLoading: isLoadingPhotos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePhotos(albumId);

  const deleteAlbumMutation = useDeleteAlbum();
  const createPhotoMutation = useCreatePhoto();
  const deletePhotoMutation = useDeletePhoto();

  const photos = photosData?.pages.flatMap(page => page.data) ?? [];

  const [view, setView] = useState<ViewType>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoDate, setPhotoDate] = useState<Date | undefined>(new Date());
  const [isDeleteAlbumOpen, setIsDeleteAlbumOpen] = useState(false);
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [photoColor, setPhotoColor] = useState('#000000');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbumMutation.mutateAsync(albumId);
      toast.success("Álbum excluído com sucesso!");
      setIsDeleteAlbumOpen(false);
      navigate({ to: '/' });
    } catch (error) {
      toast.error("Erro ao excluir álbum. Tente novamente.");
    }
  };

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;

    try {
      await deletePhotoMutation.mutateAsync({
        photoId: selectedPhoto.id,
        albumId
      });
      toast.success("Foto excluída com sucesso!");
      setIsDeletePhotoOpen(false);
      setSelectedPhoto(null);
    } catch (error) {
      toast.error("Erro ao excluir foto. Tente novamente.");
    }
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): File | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(`"${file.name}" não é uma imagem válida. Tipos aceitos: JPG, PNG, GIF, WebP`);
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`"${file.name}" excede o tamanho máximo de 10MB`);
      return null;
    }
    return file;
  };

  const setFile = (file: File) => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    });
  };

  const clearFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      clearFile();
      setPhotoColor('#000000');
      setPhotoTitle('');
      setPhotoDescription('');
      setPhotoDate(new Date());
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    setIsDialogOpen(open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFile = validateFile(files[0]);
      if (validFile) {
        setFile(validFile);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const validFile = validateFile(files[0]);
      if (validFile) {
        setFile(validFile);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma foto para enviar");
      return;
    }

    if (!photoTitle.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    try {
      await createPhotoMutation.mutateAsync({
        file: selectedFile.file,
        title: photoTitle.trim(),
        description: photoDescription.trim() || undefined,
        acquireAt: photoDate?.toISOString(),
        albumId,
        color: photoColor,
      });
      toast.success("Foto adicionada com sucesso!");
      handleDialogClose(false);
    } catch (error) {
      toast.error("Erro ao adicionar foto. Tente novamente.");
    }
  };

  return {
    album,
    isLoadingAlbum,
    photos,
    isLoadingPhotos,
    hasNextPage,
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
    setIsDialogOpen,
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
    isCreatingPhoto: createPhotoMutation.isPending,
  };
}
