'use client'

import PageHeader from '@/components/PageHeader'
import Spacer from '@/components/spacer'
import SubmitButton from '@/components/submitButton'
import { useState } from 'react'
import { EnrollMethodType, Enrollment } from '@/flip-api/types'
import Block from '@/components/Block'
import ProgramDecorator from '@/utils/programDecorator'
import { useRouter } from 'next/navigation'
import {
  useFlipDevices,
  useFlipEnrollments,
  useFlipProgram,
} from '@/flip-api/hooks'
import { flip } from '@/flip'
import Loader from '@/components/Loader'
import { withLoggedInLayout } from '@/app/LoggedInLayout'

const ProgramPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { program, isLoading: isProgramLoading } = useFlipProgram(params.id)
  const { devices } = useFlipDevices()
  const { enrollments, setEnrollments } = useFlipEnrollments()

  if (isProgramLoading) return <Loader />

  if (!program) {
    return <p>Program not found</p>
  }

  const decoratedProgram = new ProgramDecorator(program)

  const enrollment = enrollments?.find((e) => e.program_id === program.id)
  const isEnrolled = enrollment !== undefined

  const handleEnroll = async () => {
    setIsSubmitting(true)
    try {
      const data = await flip.createEnrollment({
        device_ids: devices!.map((d) => d.id),
        enroll_method: EnrollMethodType.USER_ACTION,
        program_id: program.id,
      })
      setEnrollments([...enrollments!, data as Enrollment])
      router.push('/')
    } catch (error: any) {
      console.error(error)
      return
    }
  }

  const handleUnenroll = async () => {
    setIsSubmitting(true)
    try {
      await flip.deleteEnrollment(enrollment!.id)
      setEnrollments([...enrollments!.filter((e) => e.id !== enrollment!.id)])
      router.push('/')
    } catch (error: any) {
      console.error(error)
      return
    }
  }

  return (
    <>
      <PageHeader title="Program details" backTo="/" />
      <div className="flex flex-col space-y-3">
        <Block label="Name" value={program.name} />
        <Block label="Description" value={program.description} />
        {program.participation_months && (
          <Block
            label="Participation"
            value={decoratedProgram.participation()}
          />
        )}
        <Block label="Earnings" value={decoratedProgram.earnings()} />
        <Block label="Commitment" value={decoratedProgram.commitment()} />
      </div>
      <Spacer />
      <SubmitButton
        onClick={isEnrolled ? handleUnenroll : handleEnroll}
        isSubmitting={isSubmitting}
      >
        {isEnrolled ? 'Leave program' : 'Enroll'}
      </SubmitButton>
    </>
  )
}

export default withLoggedInLayout(ProgramPage)
