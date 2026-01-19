import { useNavigate, useLocation, Link, Outlet } from '@tanstack/react-router';
import { useTheme } from '@/contexts/theme-context';
import { Sun, Moon, LogOut, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

export function useMainLayout() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.info("Você saiu do sistema.");
          navigate({ to: '/login' });
        }
      }
    });
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return {
    theme,
    setTheme,
    session,
    handleLogout,
    isAuthPage,
  };
}

export function MainLayout() {
  const {
    theme,
    setTheme,
    session,
    handleLogout,
    isAuthPage,
  } = useMainLayout();

  return (
    <div className={cn(
      "min-h-screen gradient-bg flex flex-col transition-all duration-1000",
      isAuthPage && "animate-spotlight"
    )}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ImageIcon className="w-6 h-6" />
            <span>PhotoManager</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {!isAuthPage && (
              <div className="flex items-center gap-3 pl-4 border-l">
                {session?.user && (
                  <span className="text-sm font-medium hidden sm:inline-block">
                    Olá, {session.user.name.split(' ')[0]}
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 ring-primary transition-all">
                      <AvatarImage src={session?.user?.image || "https://github.com/shadcn.png"} />
                      <AvatarFallback>{session?.user?.name?.substring(0, 2).toUpperCase() || 'PM'}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      <footer className="py-6 border-t bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 PhotoManager. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
