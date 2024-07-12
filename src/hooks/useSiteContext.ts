'use client'

import { useContext } from 'react'
import { SiteContext, SiteContextType } from '@/contexts/SiteContext'

const useSiteContext = (): SiteContextType => {
  return useContext(SiteContext)
}

export default useSiteContext
