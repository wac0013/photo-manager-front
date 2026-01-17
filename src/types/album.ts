export interface Album {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface CreateAlbumDto {
  title: string;
  description?: string;
}

export interface UpdateAlbumDto {
  title?: string;
  description?: string;
}

export interface InfinitePageResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AlbumsResponse extends InfinitePageResponse<Album> { }
