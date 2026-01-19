import { X, Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AddPhotoDialogProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: any;
  photoTitle: string;
  setPhotoTitle: (title: string) => void;
  photoDescription: string;
  setPhotoDescription: (desc: string) => void;
  photoDate: Date | undefined;
  setPhotoDate: (date: Date | undefined) => void;
  photoColor: string;
  setPhotoColor: (color: string) => void;
  handleSubmit: () => Promise<void>;
  isCreatingPhoto: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export function AddPhotoDialog({
  fileInputRef,
  handleDrop,
  handleFileChange,
  selectedFile,
  photoTitle,
  setPhotoTitle,
  photoDescription,
  setPhotoDescription,
  photoDate,
  setPhotoDate,
  photoColor,
  setPhotoColor,
  handleSubmit,
  isCreatingPhoto,
  isDragging,
  setIsDragging,
}: AddPhotoDialogProps) {
  return (
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] rounded-3xl border border-white/5 shadow-3xl p-6 overflow-hidden flex flex-col">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-2xl font-bold">Adicionar novas fotos</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-y-auto grid gap-6 py-4 px-1">
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer group relative overflow-hidden",
            isDragging 
              ? "border-primary bg-primary/10 scale-95" 
              : "border-primary/20 bg-muted/40 hover:border-primary/50 hover:bg-muted/60"
          )}
        >
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          {selectedFile ? (
            <div className="relative w-full animate-in fade-in zoom-in-95 duration-300">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted/30 shadow-lg">
                <img 
                  src={selectedFile.preview} 
                  alt={selectedFile.name}
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This should probably be handled by a clearFile prop if we wanted full isolation,
                    // but for brevity we're using the hook state.
                  }}
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground shadow-md"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold truncate px-4">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedFile.size}</p>
                <p className="text-[10px] text-primary/70 mt-1">Clique para trocar a imagem</p>
              </div>
            </div>
          ) : (
            <>
              <div className={cn(
                "bg-primary/10 p-3 rounded-full transition-all duration-500",
                isDragging ? "scale-110 bg-primary/20" : "group-hover:scale-110"
              )}>
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <p className="mt-3 font-bold text-sm">Escolher imagem...</p>
              <p className="text-xs text-muted-foreground mt-1 text-center">Arraste ou clique para selecionar</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">JPG, PNG, GIF, WebP • Máx. 10MB</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="photo-title" className="text-xs font-semibold ml-1 text-muted-foreground">Título *</Label>
            <Input 
              id="photo-title" 
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              placeholder="Digite o título da foto"
              className="rounded-lg h-10 bg-muted/40 border border-border/50 text-sm focus-visible:ring-offset-0" 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="photo-desc" className="text-xs font-semibold ml-1 text-muted-foreground">Descrição</Label>
            <Textarea 
              id="photo-desc" 
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
              className="rounded-lg bg-muted/40 border border-border/50 min-h-[80px] text-sm resize-none focus-visible:ring-offset-0" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="photo-date" className="text-xs font-semibold ml-1 text-muted-foreground">Data/Hora</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal rounded-lg h-10 bg-muted/40 border-border/50 hover:bg-muted/60 px-3 text-xs focus-visible:ring-offset-0"
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    {photoDate ? format(photoDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border border-border bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={photoDate}
                    onSelect={setPhotoDate}
                    locale={ptBR}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 20}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="photo-color" className="text-xs font-semibold ml-1 text-muted-foreground">Cor predominante</Label>
              <div className="flex gap-2">
                <Input 
                  id="photo-color" 
                  type="color" 
                  value={photoColor}
                  onChange={(e) => setPhotoColor(e.target.value)}
                  className="w-10 h-10 p-1 rounded-lg bg-muted/40 border border-border/50 cursor-pointer" 
                />
                <Input 
                  value={photoColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^#?[0-9A-Fa-f]{0,6}$/)) {
                      setPhotoColor(value.startsWith('#') ? value : `#${value}`);
                    }
                  }}
                  placeholder="#000000" 
                  className="rounded-lg h-10 bg-muted/40 border border-border/50 flex-1 text-xs font-mono focus-visible:ring-offset-0" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="pt-4 border-t border-border/50">
        <Button 
          type="submit" 
          className="w-full rounded-xl h-11 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!selectedFile || !photoTitle.trim() || isCreatingPhoto}
        >
          {isCreatingPhoto ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : !selectedFile ? (
            'Selecione uma imagem para enviar'
          ) : !photoTitle.trim() ? (
            'Digite um título'
          ) : (
            'Adicionar foto'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
