'use client'

import { withLoggedInLayout } from '@/app/LoggedInLayout'
import Events from '@/app/Events'
import Programs from './Programs'
import {
  useFlipDevices,
  useFlipEnrollments,
  useFlipPrograms,
  useFlipSite,
} from '@/flip-api/hooks'
import Loader from '@/components/Loader'

const Dashboard = () => {
  const { site, isLoading: siteIsLoading } = useFlipSite()
  const { devices, isLoading: devicesAreLoading } = useFlipDevices()
  const { enrollments, isLoading: enrollmentsAreLoading } = useFlipEnrollments()
  const { programs, isLoading: programsAreLoading } = useFlipPrograms(
    site?.zip_code
  )

  if (siteIsLoading || devicesAreLoading) return <Loader />

  if (!site || !devices) {
    return (
      <p>
        Site or devices not found. Please make sure they were properly
        commissioned.
      </p>
    )
  }

  if (enrollmentsAreLoading) return <Loader />

  if (enrollments && enrollments.length > 0) {
    return <Events />
  }

  if (programsAreLoading) return <Loader />

  if (programs) {
    if (programs.length > 0) return <Programs />
    else return <p>No VPP programs are available in your area</p>
  }
}

export default withLoggedInLayout(Dashboard)
