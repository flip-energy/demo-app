'use client'

import React from 'react'
import Link from 'next/link'
import { UserIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks'
import Loader from '@/components/Loader'
import { flip } from '@/flip'

function LoggedInLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useCurrentUser({
    requireUser: { redirectTo: '/login' },
  })

  if (isUserLoading) return <Loader />

  if (user) flip.setSiteId(user.site_id)

  return (
    <>
      <div className="flex mb-4 w-full flex-row">
        <div className="flex ml-auto">
          <Link href="/profile" className="border rounded-full border-black">
            <UserIcon />
          </Link>
        </div>
      </div>
      {children}
    </>
  )
}

const withLoggedInLayout = (WrappedComponent: React.ComponentType<any>) => {
  const ComponentWithLayout: React.FC<any> = (props) => {
    return (
      <LoggedInLayout>
        <WrappedComponent {...props} />
      </LoggedInLayout>
    )
  }
  ComponentWithLayout.displayName = 'ComponentWithLayout'
  return ComponentWithLayout
}

export { withLoggedInLayout }
