import { TailSpin } from 'react-loading-icons'

interface SpinnerProps {
  className?: string
  color?: string
  speed?: number
  size?: number
}

const Spinner = ({
  className,
  color = '#000',
  size,
  speed = 1.75,
}: SpinnerProps) => (
  <TailSpin
    className={className}
    height={size}
    speed={speed}
    stroke={color}
    width={size}
  />
)

export default Spinner
