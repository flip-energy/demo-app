'use client'

import { formatMoney } from '@/utils'
import { Program } from '@/flip-api/types'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks'
import { useFlipPrograms } from '@/flip-api/hooks'
import Loader from '@/components/Loader'

const Programs = () => {
  const { user } = useCurrentUser()
  const { programs, isLoading } = useFlipPrograms(user?.zip_code)

  if (isLoading) return <Loader />

  if (!programs) return null

  const getEarnings = (program: Program): string => {
    const earnings = []
    if (program.earnings_for_site_upfront) {
      earnings.push(`${formatMoney(program.earnings_for_site_upfront)} upfront`)
    }
    if (program.earnings_for_site_yearly) {
      earnings.push(`${formatMoney(program.earnings_for_site_yearly)} yearly`)
    }
    return earnings.length > 0 ? `Up to ${earnings.join(' and ')}` : ''
  }

  return (
    <>
      <h1 className="font-bold text-2xl mb-2 text-center">Good news!</h1>
      <p className="text-center text-gray-400">
        The following VPP programs are available in your area:
      </p>
      <ul className="flex flex-col space-y-3 my-5">
        {programs.map((program: any) => (
          <li key={program.id}>
            <Link
              href={`/programs/${program.id}`}
              className="border border-gray-300 bg-gray-100 rounded p-3 flex items-top"
            >
              <div>
                <p className="font-medium mb-1">{program.name}</p>
                <p className="mb-1">{getEarnings(program)}</p>
                <p className="text-gray-400">{program.description}</p>
              </div>
              <ChevronRightIcon size={20} className="ml-auto" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="font-medium mb-1">What is a VPP?</p>
      <p className="text-gray-400">
        VPP stands for Virtual Power Plant. It’s a way for homeowners to
        contribute to a more resilient and more affordable electric grid by
        either using less power or event selling power back during times of
        extreme demand.
      </p>
    </>
  )
}

export default Programs
