import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'

type SubmitButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  children?: React.ReactNode
  isSubmitting?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isSubmitting = false,
  ...props
}: SubmitButtonProps) => (
  <Button type="submit" disabled={isSubmitting} {...props}>
    {isSubmitting ? <Spinner size={23} color="#fff" /> : children || 'Continue'}
  </Button>
)

export default SubmitButton
