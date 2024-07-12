'use client'

import { UserContext } from '@/contexts/UserContext'
import { useEffect, useState } from 'react'
import { User } from '@/flip-api/types'
import { supabase } from '@/utils'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function LayoutState({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true)

  useEffect(() => {
    const extractUserFromSession = async (session: Session | null) => {
      const currentUser = session?.user
      if (currentUser) {
        const { data: userMeta } = await supabase
          .from('user_metadata')
          .select('*')
          .eq('id', currentUser?.id)
          .single()
        setUser({ ...userMeta, ...currentUser })
      } else setUser(null)
    }

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await extractUserFromSession(session)
      setIsUserLoading(false)
    }
    getUser()

    supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        extractUserFromSession(session)
        setIsUserLoading(false)
      }
    )
  }, [])

  return (
    <UserContext.Provider
      value={{ user, setUser, isUserLoading, setIsUserLoading }}
    >
      {children}
    </UserContext.Provider>
  )
}
