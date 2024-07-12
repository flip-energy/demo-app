'use client'

import Spinner from '@/components/spinner'
import PageHeader from '@/components/PageHeader'
import Block from '@/components/Block'
import { capitalizeString, formatDate } from '@/utils'
import { useState } from 'react'
import { Enrollment, Program } from '@/flip-api/types'
import ProgramDecorator from '@/utils/programDecorator'
import Spacer from '@/components/spacer'
import { Button } from '@/components/ui/button'
import AlertDialog from '@/components/AlertDialog'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFlipEnrollments } from '@/flip-api/hooks'
import { flip } from '@/flip'

interface PropsType {
  enrollment: Enrollment
  program: Program
}

const EnrollmentContent = ({ enrollment, program }: PropsType) => {
  const { setEnrollments } = useFlipEnrollments()
  const [open, setOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const decoratedProgram = new ProgramDecorator(program)

  const handleUnenroll = async () => {
    setIsSubmitting(true)
    try {
      await flip.deleteEnrollment(enrollment.id)
      setEnrollments([])
      router.push('/')
    } catch (error: any) {
      console.error(error)
      return
    }
    setOpen(false)
    setIsSubmitting(false)
  }

  return (
    <>
      <PageHeader title="Enrollment details" backTo="/events" />
      <div className="flex flex-col space-y-3">
        <Block label="Program name" value={program.name} />
        <Block label="Program description" value={program.description} />
        <Block label="Participation" value={decoratedProgram.participation()} />
        <Block label="Incentive" value={decoratedProgram.earnings()} />
        <Block label="Status" value={capitalizeString(enrollment.status)} />
        <Block
          label="Enrolled since"
          value={formatDate(new Date(enrollment.enrolled_at!))}
        />
        <Block label="Commitment" value={decoratedProgram.commitment()} />
      </div>
      <Spacer />
      <div className="flex flex-col space-y-2 mt-4">
        <Button asChild={true}>
          <Link href="/support">Support</Link>
        </Button>
        <Button onClick={() => setOpen(true)} variant="outline" type="button">
          Leave program
        </Button>
      </div>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        title={<AlertCircleIcon />}
        description="Are you sure you want to leave the program?"
        onConfirm={handleUnenroll}
        onCancel={() => setOpen(false)}
        confirmLabel={isSubmitting ? <Spinner size={23} /> : "Yes, I'm sure"}
        cancelLabel="No, cancel"
      />
    </>
  )
}

export default EnrollmentContent
