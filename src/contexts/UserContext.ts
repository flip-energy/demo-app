import { createContext } from 'react'
import { User } from '@/flip-api/types'

type UserContextType = {
  isUserLoading: boolean
  user: User | null
  setIsUserLoading: (isUserLoading: boolean) => void
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType>({
  isUserLoading: true,
  user: null,
  setIsUserLoading: () => {},
  setUser: () => {},
})
