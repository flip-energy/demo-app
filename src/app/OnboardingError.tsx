import Spacer from '@/components/spacer'
import { OnboardingStatus } from '@/flip-api/types'

const OnboardingError = ({ error }: { error: OnboardingStatus }) => {
  let message = 'Something went wrong. Please try again later.'
  switch (error) {
    case OnboardingStatus.INELIGIBLE_NO_UTILITY:
    case OnboardingStatus.INELIGIBLE_NO_PROGRAM:
      message = 'Unfortunately, your utility is not supported.'
      break
    case OnboardingStatus.INELIGIBLE_BATTERY_CANNOT_EXPORT:
      message = 'Unfortunately, your battery cannot export to the grid.'
      break
    case OnboardingStatus.INELIGIBLE_WAITLISTED:
      message = `You're on our waitlist. We'll notify you when we add support for your utility.`
      break
    default:
      break
  }

  return (
    <>
      <Spacer />
      <div className="text-center">{message}</div>
      <Spacer />
    </>
  )
}

export default OnboardingError
