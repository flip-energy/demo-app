'use client'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks'
import { supabase } from '@/utils'
import { LogOutIcon } from 'lucide-react'

const LogOut = () => {
  const { setUser, user } = useCurrentUser({ requireUser: { redirectTo: '/' } })

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) setUser(null)
  }

  if (!user) return null // This shouldn't happen.

  return (
    <>
      <Button onClick={handleLogOut}>
        <LogOutIcon className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </>
  )
}

export default LogOut
