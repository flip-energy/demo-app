'use client'

import { UserContext } from '@/contexts/UserContext'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { supabase } from '@/utils'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Toaster } from '@/components/ui/toaster'

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
      setIsUserLoading(false)
    }

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      extractUserFromSession(session)
    }
    getUser()

    supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        extractUserFromSession(session)
      }
    )
  }, [])

  return (
    <UserContext.Provider
      value={{ user, setUser, isUserLoading, setIsUserLoading }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  )
}
