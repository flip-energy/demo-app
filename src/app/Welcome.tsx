'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Spacer from '@/components/spacer'

const Welcome = () => {
  return (
    <>
      <Spacer />
      <h1 className="text-xl font-bold">Welcome!</h1>
      <Spacer />
      <Button asChild={true}>
        <Link href="/login">Get started</Link>
      </Button>
    </>
  )
}

export default Welcome
