import Tag from '@/components/Tag'

const Card = ({
  className,
  children,
  siblings,
  tagName = 'div',
}: {
  className?: string
  children: any
  siblings?: any
  tagName?: string
}) => {
  return (
    <Tag
      tagName={tagName}
      className={`flex p-5 rounded-md flex-1 border border-gray-400 bg-gray-50 ${
        className || ''
      }`}
    >
      <div className="flex flex-col justify-center space-y-1 flex-1">
        {children}
      </div>
      {siblings}
    </Tag>
  )
}

export default Card
