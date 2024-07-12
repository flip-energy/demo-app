import { createContext } from 'react'
import { Device, Enrollment, Program, Site, SiteToken } from '@/flip-api/types'

export type SiteContextType = {
  devices: Device[] | null
  enrollments: Enrollment[] | null
  isContextLoading: any
  programs: Program[] | null
  setEnrollments: (
    newState:
      | Enrollment[]
      | null
      | ((prevState: Enrollment[] | null) => Enrollment[])
  ) => void
  site: Site | null
  siteToken: SiteToken | null
}

export const SiteContext = createContext<SiteContextType>({
  devices: null,
  enrollments: null,
  isContextLoading: {},
  programs: null,
  setEnrollments: () => {},
  site: null,
  siteToken: null,
})
