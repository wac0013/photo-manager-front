import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateAlbumDialogProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  handleCreateAlbum: () => Promise<void>;
  isCreatingAlbum: boolean;
}

export function CreateAlbumDialog({
  title,
  setTitle,
  description,
  setDescription,
  handleCreateAlbum,
  isCreatingAlbum,
}: CreateAlbumDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px] rounded-3xl border border-white/5 shadow-3xl p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Criar novo álbum</DialogTitle>
        <DialogDescription>
          Dê um título e uma descrição para o seu novo álbum.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-semibold ml-1 text-muted-foreground">Título *</Label>
          <Input 
            id="title" 
            placeholder="Ex: Viagem de Verão" 
            className="rounded-xl h-11 bg-muted/50 border-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold ml-1 text-muted-foreground">Descrição</Label>
          <Textarea 
            id="description" 
            placeholder="Sobre o que é este álbum?" 
            className="rounded-xl min-h-[100px] bg-muted/50 border-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="submit" 
          className="w-full rounded-xl h-11 shadow-lg shadow-primary/20 font-bold"
          onClick={handleCreateAlbum}
          disabled={isCreatingAlbum}
        >
          {isCreatingAlbum ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            'Concluir'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
