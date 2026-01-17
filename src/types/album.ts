export const DEFAULT_PAGE_SIZE = 10;

export interface Album {
  id: string;
  title: string;
  description: string | null;
  hasImages: boolean;
  coverPhoto?: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  color: string;
  acquireAt: string | null;
  albumId: string;
  createdAt: string;
  sizeFormatted: string | null;
}

export interface CreateAlbumDto {
  title: string;
  description?: string;
}

export interface UpdateAlbumDto {
  title?: string;
  description?: string;
}

export interface CreatePhotoDto {
  title: string;
  description?: string;
  acquireAt?: string;
  albumId: string;
  color?: string;
}

export interface UpdatePhotoDto {
  title?: string;
  description?: string;
  acquireAt?: string;
  color?: string;
}

export interface InfinitePageResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AlbumsResponse extends InfinitePageResponse<Album> { }

export interface PhotosResponse extends InfinitePageResponse<Photo> { }
