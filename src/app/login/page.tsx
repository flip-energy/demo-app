'use client'

import * as z from 'zod'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils'
import EmailForm, {
  formSchema as emailFormSchema,
} from '@/components/login/EmailForm'
import OtpForm, {
  formSchema as otpFormSchema,
} from '@/components/login/OtpForm'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks'
import Spacer from '@/components/spacer'
import next from 'next'
import getUserOnboardingStatus from '@/utils/supabase/getUserOnboardingStatus'
import { OnboardingStatus } from '@/flip-api/types'

const Login = () => {
  const { setIsUserLoading } = useCurrentUser({
    requireNoUser: { redirectTo: '/' },
  })
  const [email, setEmail] = useState<string>('')
  const [otpError, setOtpError] = useState<string>('')
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const onSubmitEmailForm = async (values: z.infer<typeof emailFormSchema>) => {
    setIsFormSubmitting(true)
    setEmail(values.email)
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    })
    setIsFormSubmitting(false)
    if (error) {
      setOtpSent(false)
    } else {
      setOtpSent(true)
    }
  }

  const onSubmitOtpForm = async (values: z.infer<typeof otpFormSchema>) => {
    setIsFormSubmitting(true)
    setIsUserLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: values.code,
      type: 'email',
    })

    if (error) {
      setOtpError(error.message)
      setIsFormSubmitting(false)
      return
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionData?.session?.user) {
      const onboardingStatus = await getUserOnboardingStatus(
        supabase,
        sessionData.session.user.id
      )

      let nextRoute = '/'
      switch (onboardingStatus) {
        case OnboardingStatus.NEW:
          nextRoute = '/onboarding'
          break
        case OnboardingStatus.METER_CREATED:
          nextRoute = '/onboarding/connect'
          break
        case OnboardingStatus.BATTERY_CONNECTED:
          nextRoute = '/onboarding/complete'
          break
        case OnboardingStatus.ENROLLED:
          nextRoute = '/'
          break
        case OnboardingStatus.INELIGIBLE_NO_UTILITY:
        case OnboardingStatus.INELIGIBLE_NO_PROGRAM:
        case OnboardingStatus.INELIGIBLE_BATTERY_CANNOT_EXPORT:
        case OnboardingStatus.INELIGIBLE_WAITLISTED:
          nextRoute = '/onboarding/complete'
          break
        default:
          nextRoute = '/'
          break
      }
      router.push(nextRoute)
    }
    setIsUserLoading(false)
  }

  const handleCancelOtp = () => {
    setOtpError('')
    setOtpSent(false)
  }

  return (
    <>
      <Spacer />
      {otpSent ? (
        <OtpForm
          email={email}
          onSubmit={onSubmitOtpForm}
          error={otpError}
          onCancel={handleCancelOtp}
          isSubmitting={isFormSubmitting}
        />
      ) : (
        <EmailForm
          onSubmit={onSubmitEmailForm}
          isSubmitting={isFormSubmitting}
        />
      )}
      <Spacer />
    </>
  )
}

export default Login
