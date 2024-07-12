'use client'

import PageCard from '@/components/PageCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Support = () => {
  return (
    <PageCard
      imgUrl={'https://picsum.photos/400/300'}
      title={`Need help?`}
      backTo="/"
      header="Support"
      button={
        <Button asChild={true}>
          <Link href="mailto:support@help.com">Contact us</Link>
        </Button>
      }
    >
      <>We are always happy to hear feedback from our users!</>
    </PageCard>
  )
}

export default Support
