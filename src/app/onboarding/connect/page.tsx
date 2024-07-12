'use client'

import Connect from '@/app/onboarding/connect/Connect'
import Spacer from '@/components/spacer'
import { useCurrentUser } from '@/hooks'

const ConnectPage = () => {
  useCurrentUser({ requireUser: true })

  return (
    <>
      <Spacer />
      <p className="mb-6">Next, we need to connect to your battery.</p>
      <Connect
        deviceName="battery"
        deviceType="battery"
        nextUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/complete`}
      />
      <Spacer />
    </>
  )
}

export default ConnectPage
