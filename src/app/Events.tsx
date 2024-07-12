'use client'

import EventsList from './events/Events'
import { EnrollmentStatus } from '@/flip-api/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PageCard from '@/components/PageCard'
import PageHeader from '@/components/PageHeader'
import { InfoIcon } from 'lucide-react'
import Loader from '@/components/Loader'
import { useFlipEnrollments, useFlipProgram } from '@/flip-api/hooks'

const Events = () => {
  const { enrollments, isLoading: isEnrollmentsLoading } = useFlipEnrollments()
  const enrollment = enrollments ? enrollments[0] : undefined
  const { program, isLoading: isProgramsLoading } = useFlipProgram(
    enrollment?.program_id
  )

  if (isEnrollmentsLoading || isProgramsLoading) return <Loader />

  if (!enrollment || !program) return null

  if (enrollment.status === EnrollmentStatus.PENDING) {
    return (
      <PageCard
        header="Virtual Power Plant"
        title={`Thank you for enrolling in ${program.name}!`}
        imgUrl={'https://picsum.photos/400/300'}
      >
        <>
          Before you can start participating and earning rewards, your utility
          need to review and provide its approval. <br />
          <br />
          You will receive an email when your enrollment is confirmed.
        </>
      </PageCard>
    )
  }
  if (enrollment.status === EnrollmentStatus.ACTIVE) {
    return (
      <>
        <PageHeader
          title="Virtual Power Plant"
          rightChild={
            <Link href="/enrollment">
              <InfoIcon />
            </Link>
          }
        />
        <EventsList />
      </>
    )
  }
  if (enrollment.status === EnrollmentStatus.REJECTED) {
    return (
      <PageCard
        header="Virtual Power Plant"
        title={`Unfortunately you cannot participate`}
        imgUrl={'https://picsum.photos/400/300'}
        button={
          <Button asChild={true} variant="outline">
            <Link href="/support">Support</Link>
          </Button>
        }
      >
        <>
          Here is the reason provided by the utility: <br />
          {enrollment.status_reason}
          <br />
          <br />
          If you would like to appeal or have questions, please contact support
          below.
          <br />
        </>
      </PageCard>
    )
  }
}

export default Events
