'use client'

import Spacer from '@/components/spacer'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks'
import { supabase, fetchApi } from '@/utils'
import getUserOnboardingStatus from '@/utils/supabase/getUserOnboardingStatus'
import updateUserMetadata from '@/utils/supabase/updateUserMetadata'
import { CheckCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const pollForBattery = async (timeout: Date): Promise<any | null> => {
  let battery: any | null = null
  while (!battery) {
    // Quit if we've timed out.
    if (new Date() > timeout) {
      return null
    }
    const { data } = await supabase
      .from('batteries')
      .select('*')
      .limit(1)
      .single()
    if (data) {
      battery = data
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  return battery
}

const CompletePage = () => {
  const { user } = useCurrentUser({ requireUser: true })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false)
  const [isIneligible, setIsIneligible] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    if (!user) return

    // This is how we wait to receive the webhook back from Enode, which triggers the battery to be created locally and on the DERMS.
    const fetchBattery = async () => {
      const now = new Date()
      // Time out after 1 minute.
      const timeout = new Date(now.getTime() + 60000)
      let battery: any | null = null
      battery = await pollForBattery(timeout)
      if (!battery) {
        setHasTimedOut(true)
        setIsLoading(false)
        return
      }
      if (!battery.can_export) {
        const metaError = await updateUserMetadata(
          supabase,
          user!.id,
          'INELIGIBLE_BATTERY_CANNOT_EXPORT'
        )
        setIsIneligible(true)
        setIsLoading(false)
        return
      }
      const { error: enrollmentError } = await fetchApi('/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          batteryId: battery.id,
        }),
      })
      if (enrollmentError) {
        console.error(enrollmentError)
        setHasError(true)
        setIsLoading(false)
        return
      }

      const error = await updateUserMetadata(supabase, user?.id, 'ENROLLED')
      if (error) {
        console.error(error)
        setHasError(true)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    }
    fetchBattery()
  }, [user])

  if (hasTimedOut) {
    return (
      <>
        <Spacer />
        <div className="text-center">{`We're still finalizing your account. Please try again later.`}</div>
        <Spacer />
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Spacer />
        <div className="text-center">{`Something wrong happened while setting up your account. Please try again later.`}</div>
        <Spacer />
      </>
    )
  }

  if (isIneligible) {
    return (
      <>
        <Spacer />
        <div className="text-center">{`We're sorry, but unfortunately you're not eligible to participate in our program because your battery isn't able to export to the grid.`}</div>
        <Spacer />
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Spacer />
        <div className="flex justify-center mb-4">
          <Spinner color="#000" />
        </div>
        <div className="text-center">{`We're finalizing your account, please wait.`}</div>
        <Spacer />
      </>
    )
  }

  return (
    <>
      <Spacer />
      <div className="flex justify-center mb-4">
        <CheckCircle2Icon size={40} />
      </div>
      <div className="text-center">{`You're all set! We're ready to help you sell your energy.`}</div>
      <Spacer />
      <Button asChild={true}>
        <Link href="/">Go to dashboard</Link>
      </Button>
      <Spacer />
    </>
  )
}

export default CompletePage
