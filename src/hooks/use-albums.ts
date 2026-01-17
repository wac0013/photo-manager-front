import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Album, CreateAlbumDto, UpdateAlbumDto, AlbumsResponse } from '@/types/album';
import { AxiosError } from 'axios';

const ALBUMS_QUERY_KEY = ['albums'];
const PHOTO_SERVICE_BASE = '/photos/v1';

export function useAlbums() {
  return useInfiniteQuery<AlbumsResponse, AxiosError>({
    queryKey: ALBUMS_QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append('size', '20');
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
