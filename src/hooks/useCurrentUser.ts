'use client'

import { useContext, useEffect } from 'react'
import { UserContext } from '@/contexts/UserContext'
import { User } from '@/flip-api/types'
import { useRouter } from 'next/navigation'

type RequireProps = {
  redirectTo?: string
}

type UseCurrentUserProps = {
  requireNoUser?: boolean | RequireProps
  requireUser?: boolean | RequireProps
}

type UseCurrentUserReturn = {
  isUserLoading: boolean
  user: User | null
  setIsUserLoading: (isUserLoading: boolean) => void
  setUser: (user: User | null) => void
}

const useCurrentUser = (props?: UseCurrentUserProps): UseCurrentUserReturn => {
  const { requireNoUser = false, requireUser = false } = props || {}
  const router = useRouter()
  const { isUserLoading, user, setIsUserLoading, setUser } =
    useContext(UserContext)

  useEffect(() => {
    if (!isUserLoading && !!requireUser && !user) {
      router.push(
        typeof requireUser === 'boolean' || !requireUser.redirectTo
          ? '/login'
          : requireUser.redirectTo
      )
    }
    if (!isUserLoading && !!requireNoUser && user) {
      router.push(
        typeof requireNoUser === 'boolean' || !requireNoUser.redirectTo
          ? '/login'
          : requireNoUser.redirectTo
      )
    }
  }, [isUserLoading, requireNoUser, requireUser, router, user])

  return { isUserLoading, user, setIsUserLoading, setUser }
}

export default useCurrentUser
