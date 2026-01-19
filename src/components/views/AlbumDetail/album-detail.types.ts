
export interface SelectedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
}

export type ViewType = 'grid' | 'table';

export interface AlbumDetailProps {
  albumId: string;
}
