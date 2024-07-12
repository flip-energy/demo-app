'use client'

import { useCurrentUser } from '@/hooks'
import Dashboard from './Dashboard'
import Welcome from './Welcome'
import Loader from '@/components/Loader'

const Home = () => {
  const { isUserLoading, user } = useCurrentUser()

  if (isUserLoading) return <Loader />

  return user ? <Dashboard /> : <Welcome />
}

export default Home
