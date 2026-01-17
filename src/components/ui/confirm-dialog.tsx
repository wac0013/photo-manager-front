import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  children?: React.ReactNode
  title: string
  description: string
  cancelText?: string
  confirmText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDialog({
  children,
  title,
  description,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  variant = "default",
  onConfirm,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent className="rounded-3xl border border-white/5 shadow-3xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
          <AlertDialogCancel className="rounded-xl h-11 border-none bg-muted/50 hover:bg-muted/70">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "rounded-xl h-11 font-bold shadow-lg shadow-primary/10",
              variant === "destructive" 
                ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                : "bg-primary hover:bg-primary/90 shadow-primary/20"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
