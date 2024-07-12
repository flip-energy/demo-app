import { flip } from '@/flip'
import {
  Device,
  DeviceType,
  Enrollment,
  EnrollmentStatus,
  Event,
  Program,
  Site,
} from '@/flip-api/types'
import { useEffect, useState } from 'react'

// useFlip hook
// Args:
// - fn: flip function or null
// - any: any arguments required by the above function
function useFlip<T>(
  fn: ((...args: any[]) => Promise<T>) | null,
  ...args: any[]
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMsg, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data === null && !isLoading && typeof fn === 'function') {
      setIsLoading(true)
      fn.apply(flip, args)
        .then((data) => {
          setData(data)
        })
        .catch((error: any) => {
          console.error(error)
          setError(error.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [data, isLoading, fn, args])

  return { data, setData, isLoading, error: errorMsg }
}

interface ReturnType {
  isError: boolean
  isLoading: boolean
}

export const useFlipDevices = (): ReturnType & { devices: Device[] | null } => {
  const { data, error, isLoading } = useFlip<Device[]>(flip.getDevices)
  return {
    devices: data,
    isError: !!error,
    isLoading,
  }
}
export const useFlipDevice = (
  id: string | null | undefined
): ReturnType & { device: Device | null } => {
  const { data, error, isLoading } = useFlip<Device>(
    id ? flip.getDevice : null,
    id
  )
  return {
    device: data,
    isError: !!error,
    isLoading,
  }
}

export const useFlipEnrollments = (): ReturnType & {
  enrollments: Enrollment[] | null
  setEnrollments: (data: Enrollment[]) => void
} => {
  const { data, error, isLoading, setData } = useFlip<Enrollment[]>(
    flip.getEnrollments
  )
  return {
    enrollments:
      data?.filter(
        (enrollment) => enrollment.status !== EnrollmentStatus.UNENROLLED
      ) || null,
    isError: !!error,
    isLoading,
    setEnrollments: setData,
  }
}

export const useFlipEvents = (): ReturnType & {
  events: Event[] | null
} => {
  const { data, error, isLoading } = useFlip<Event[]>(flip.getEvents)
  return {
    events: data,
    isError: !!error,
    isLoading,
  }
}

export const useFlipEvent = (
  id: string
): ReturnType & {
  event: Event | null
} => {
  const { data, error, isLoading } = useFlip<Event>(flip.getEvent, id)
  return {
    event: data,
    isError: !!error,
    isLoading,
  }
}

export const useFlipPrograms = (
  zipCode: string | null | undefined
): ReturnType & { programs: Program[] | null } => {
  zipCode = '88801' // TODO: remove override outside of testing
  const { data, error, isLoading } = useFlip<Program[]>(
    zipCode ? flip.getPrograms : null,
    {
      zipCode,
      deviceType: DeviceType.BATTERY,
    }
  )
  return {
    programs: data,
    isError: !!error,
    isLoading,
  }
}

export const useFlipProgram = (
  programId: string | null | undefined
): ReturnType & { program: Program | null } => {
  const { data, error, isLoading } = useFlip<Program>(
    programId ? flip.getProgram : null,
    programId
  )
  return {
    program: data,
    isError: !!error,
    isLoading,
  }
}

export const useFlipSite = (): ReturnType & {
  site: Site | null
} => {
  const { data, error, isLoading } = useFlip<Site>(flip.getSite)
  return {
    site: data,
    isError: !!error,
    isLoading,
  }
}
