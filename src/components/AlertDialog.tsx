import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DialogProps {
  cancelLabel?: string | React.ReactNode
  confirmLabel?: string | React.ReactNode
  description: string | React.ReactNode
  onCancel?: () => void
  onConfirm?: () => void
  open: boolean
  setOpen: (open: boolean) => void
  title: string | React.ReactNode
}

const Dialog = ({
  cancelLabel = 'Cancel',
  confirmLabel = 'Continue',
  description,
  onCancel = () => {},
  onConfirm = () => {},
  open,
  setOpen,
  title,
}: DialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Dialog
