const Block = ({
  label,
  value,
}: {
  label: string
  value: string | React.ReactNode
}) => (
  <div className="flex flex-col space-y-0.5">
    <div className="text-gray-400">{label}:</div>
    <div className="font-medium">{value}</div>
  </div>
)

export default Block
