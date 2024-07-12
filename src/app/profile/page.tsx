'use client'

import Spacer from '@/components/spacer'
import LogOut from './LogOut'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks'

const Profile = () => {
  const { user } = useCurrentUser({ requireUser: true })

  if (!user) return null // This shouldn't happen because of requireUser: true

  return (
    <>
      <Link
        href="/"
        className="flex border-b pb-4 mb-4 border-gray-200 relative"
      >
        <div className="absolute top-0 left-0 text-gray-500">
          <ChevronLeftIcon size={16} />
        </div>
        <div className="flex flex-col justify-center space-y-1 items-center flex-1">
          <div className="">Profile</div>
        </div>
      </Link>
      <div className="flex flex-col space-y-4">
        <div>
          Logged in as <span className="font-bold">{user.email}</span>
        </div>
      </div>
      <Spacer />
      <LogOut />
    </>
  )
}

export default Profile
