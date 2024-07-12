'use client'

import Loader from '@/components/Loader'
import Content from './Content'
import { useFlipEnrollments, useFlipProgram } from '@/flip-api/hooks'
import { withLoggedInLayout } from '@/app/LoggedInLayout'

const EnrollmentPage = () => {
  const { enrollments, isLoading: areEnrollmentsLoading } = useFlipEnrollments()
  const { program, isLoading: isProgramLoading } = useFlipProgram(
    enrollments?.[0]?.program_id
  )

  if (areEnrollmentsLoading || isProgramLoading) {
    return <Loader />
  }

  const enrollment = enrollments?.[0]

  if (!enrollment || !program) return null

  return <Content enrollment={enrollment} program={program} />
}

export default withLoggedInLayout(EnrollmentPage)
