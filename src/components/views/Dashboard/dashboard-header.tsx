import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateAlbumDialog } from './create-album-dialog';

interface DashboardHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  handleCreateAlbum: () => Promise<void>;
  isCreatingAlbum: boolean;
}

export function DashboardHeader({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  title,
  setTitle,
  description,
  setDescription,
  handleCreateAlbum,
  isCreatingAlbum,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Meus álbuns de fotos</h1>
        <p className="text-muted-foreground">Gerencie suas coleções e memórias.</p>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full px-6 shadow-md hover:shadow-xl hover:scale-105 transition-all gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Criar novo álbum
          </Button>
        </DialogTrigger>
        <CreateAlbumDialog 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          handleCreateAlbum={handleCreateAlbum}
          isCreatingAlbum={isCreatingAlbum}
        />
      </Dialog>
    </div>
  );
}
