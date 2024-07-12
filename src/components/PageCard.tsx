import PageHeader from '@/components/PageHeader'
import Image from 'next/image'
import Spacer from '@/components/spacer'

const PageCard = ({
  backTo,
  button,
  children,
  header,
  imgUrl,
  title,
}: {
  backTo?: string
  button?: React.ReactNode
  children: React.ReactNode
  header?: string
  imgUrl: string
  title: string
}) => {
  return (
    <>
      {header && <PageHeader title={header} backTo={backTo} />}
      <h1 className="font-bold text-2xl mb-4 text-center">{title}</h1>
      <Image
        src={imgUrl}
        alt="Enrollment"
        width={400}
        height={300}
        className="mb-4 rounded w-full"
      />
      <p className="text-gray-400 text-center mb-4">{children}</p>
      <Spacer />
      {button}
    </>
  )
}

export default PageCard
