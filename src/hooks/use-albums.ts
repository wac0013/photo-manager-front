import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Album, Photo, CreateAlbumDto, UpdateAlbumDto, AlbumsResponse, PhotosResponse } from '@/types/album';
import { AxiosError } from 'axios';

export interface CreatePhotoInput {
  file: File;
  title: string;
  description?: string;
  acquireAt?: string;
  albumId: string;
  color?: string;
}

const ALBUMS_QUERY_KEY = ['albums'];
const PHOTOS_QUERY_KEY = ['photos'];
const PHOTO_SERVICE_BASE = '/photos/v1';
const PAGE_SIZE = 10;

export function useAlbums() {
  return useInfiniteQuery<AlbumsResponse, AxiosError>({
    queryKey: ALBUMS_QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('size', String(PAGE_SIZE));
      if (pageParam) {
        params.append('cursor', pageParam as string);
      }
      const response = await api.get<AlbumsResponse>(
        `${PHOTO_SERVICE_BASE}/albums?${params.toString()}`
      );
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function usePhotos(albumId: string) {
  return useInfiniteQuery<PhotosResponse, AxiosError>({
    queryKey: [...PHOTOS_QUERY_KEY, albumId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('size', String(PAGE_SIZE));
      if (pageParam) {
        params.append('cursor', pageParam as string);
      }
      const response = await api.get<PhotosResponse>(
        `${PHOTO_SERVICE_BASE}/album/${albumId}?${params.toString()}`
      );
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!albumId,
  });
}

export function useAlbum(albumId: string) {
  return useQuery<Album, AxiosError>({
    queryKey: [...ALBUMS_QUERY_KEY, albumId],
    queryFn: async () => {
      const response = await api.get<Album>(`${PHOTO_SERVICE_BASE}/albums/${albumId}`);
      return response.data;
    },
    enabled: !!albumId,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation<Album, AxiosError, CreateAlbumDto>({
    mutationFn: async (data) => {
      const response = await api.post<Album>(`${PHOTO_SERVICE_BASE}/albums`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALBUMS_QUERY_KEY });
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation<Album, AxiosError, { id: string; data: UpdateAlbumDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Album>(`${PHOTO_SERVICE_BASE}/albums/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ALBUMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ALBUMS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await api.delete(`${PHOTO_SERVICE_BASE}/albums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALBUMS_QUERY_KEY });
    },
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();

  return useMutation<Photo, AxiosError, CreatePhotoInput>({
    mutationFn: async ({ file, title, description, acquireAt, albumId, color }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('albumId', albumId);

      if (description) {
        formData.append('description', description);
      }
      if (acquireAt) {
        formData.append('acquireAt', acquireAt);
      }
      if (color) {
        formData.append('color', color);
      }

      const response = await api.post<Photo>(`${PHOTO_SERVICE_BASE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...PHOTOS_QUERY_KEY, variables.albumId] });
      queryClient.invalidateQueries({ queryKey: ALBUMS_QUERY_KEY });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { photoId: string; albumId: string }>({
    mutationFn: async ({ photoId }) => {
      await api.delete(`${PHOTO_SERVICE_BASE}/${photoId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...PHOTOS_QUERY_KEY, variables.albumId] });
      queryClient.invalidateQueries({ queryKey: ALBUMS_QUERY_KEY });
    },
  });
}
