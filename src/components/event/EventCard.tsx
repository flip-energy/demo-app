import { ChevronRightIcon } from 'lucide-react'
import Card from './Card'

export const EventCard = ({
  className,
  children,
}: {
  className?: string
  children: any
}) => {
  return (
    <Card
      className={className}
      siblings={
        <div className="flex-1 flex justify-end items-center text-gray-500">
          <ChevronRightIcon size={16} />
        </div>
      }
    >
      {children}
    </Card>
  )
}

export default EventCard
