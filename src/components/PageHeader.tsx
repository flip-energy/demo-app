import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'

const PageHeader = ({
  title,
  backTo,
  rightChild,
}: {
  title: string
  backTo?: string
  rightChild?: React.ReactNode
}) => {
  return (
    <div className="flex items-center justify-between mb-5 font-medium relative">
      {backTo && (
        <Link href={backTo} className="flex flex-row items-center absolute">
          <ChevronLeftIcon /> Back
        </Link>
      )}
      <h1 className="text-center flex-1">{title}</h1>
      {rightChild && <div className="absolute right-0">{rightChild}</div>}
    </div>
  )
}

export default PageHeader
