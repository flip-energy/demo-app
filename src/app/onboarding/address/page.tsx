'use client'

import Spacer from '@/components/spacer'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Autocomplete, {
  PlaceComponent,
  PlaceField,
  PlaceFields,
  PlaceResult,
} from './Autocomplete'
import { useCurrentUser } from '@/hooks'
import SubmitButton from '@/components/submitButton'
import { Address, AddressField, OnboardingStatus } from '@/flip-api/types'
import FormattedAddress from './Address'
import { fetchApi, supabase } from '@/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import updateUserMetadata from '@/utils/supabase/updateUserMetadata'

const GMAP_FIELDS: PlaceField[] = [
  'administrative_area_level_1',
  'locality',
  'postal_code',
  'route',
  'street_number',
]

const GMAP_FIELDS_TO_DB_FIELDS: Record<PlaceField, AddressField> = {
  administrative_area_level_1: 'state',
  locality: 'city',
  postal_code: 'zip_code',
  route: 'street_name',
  street_number: 'street_number',
  country: 'country',
} as const

const formatGmapKeys = (obj: PlaceFields): Record<AddressField, string> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const formattedKey = GMAP_FIELDS_TO_DB_FIELDS[key as PlaceField]
    acc[formattedKey] = value
    return acc
  }, {} as Record<AddressField, string>)
}

const extractFieldsFromPlace = (
  arr: PlaceComponent[],
  keys: PlaceField[]
): PlaceFields => {
  return arr.reduce((acc, curr) => {
    const { long_name, types } = curr
    types.forEach((type) => {
      if (keys.includes(type as PlaceField)) {
        acc[type as PlaceField] = long_name
      }
    })
    return acc
  }, {} as PlaceFields)
}

const extractLocationFromPlace = (place: PlaceResult) => {
  const { lat, lng } = place.geometry.location
  return {
    latitude: lat(),
    longitude: lng(),
  }
}

const AddressPage = () => {
  const router = useRouter()
  const [address, setAddress] = useState<Address | null>(null)
  const { user } = useCurrentUser({ requireUser: true })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [utilityNotSupported, setUtilityNotSupported] = useState<boolean>(false)
  const [isNotificationCreated, setIsNotificationCreated] =
    useState<boolean>(false)

  const handleOnPlaceSelected = (place: PlaceResult) => {
    const extractedAddress = extractFieldsFromPlace(
      place.address_components,
      GMAP_FIELDS
    )
    setAddress({
      ...formatGmapKeys(extractedAddress),
      ...extractLocationFromPlace(place),
    })
  }

  const handleConfirmAddress = async () => {
    setIsLoading(true)
    const { data, error } = await fetchApi('/onboarding/address', {
      method: 'POST',
      body: JSON.stringify({ address }),
    })
    if (error) {
      console.error(error)
      if (
        error.message === 'INELIGIBLE_NO_UTILITY' ||
        error.message === 'INELIGIBLE_NO_PROGRAM'
      ) {
        const metaError = await updateUserMetadata(
          supabase,
          user!.id,
          error.message
        )
        setUtilityNotSupported(true)
      }

      setIsLoading(false)
      return
    }
    router.push('/onboarding/connect')
  }

  const handleChangeAddress = () => {
    setAddress(null)
    setUtilityNotSupported(false)
  }

  const handleNotify = async () => {
    if (!user) return // Should never happen.
    setIsLoading(true)
    const { error } = await supabase.from('waitlist').insert({
      user_id: user?.id,
    })
    if (error) {
      console.error(error)
      setIsLoading(false)
      return
    }
    const metaError = await updateUserMetadata(
      supabase,
      user?.id,
      OnboardingStatus.INELIGIBLE_WAITLISTED
    )
    if (metaError) {
      console.error(metaError)
      setIsLoading(false)
      return
    }
    setIsNotificationCreated(true)
  }

  if (!user) return null // Should never happen.

  if (isNotificationCreated) {
    return (
      <>
        <Spacer />
        <p className="mb-6">
          Thank you. We&apos;ll notify you when we add support for your utility.
        </p>
        <Spacer />
      </>
    )
  }

  if (utilityNotSupported) {
    return (
      <>
        <Spacer />
        <p className="mb-2">
          {`Unfortunately, we don't support your utility yet.`}
        </p>
        <p className="mb-6">
          If you&apos;d like to be notified when we do, please click the button
          below.
        </p>
        <SubmitButton onClick={handleNotify} isSubmitting={isLoading}>
          Notify me
        </SubmitButton>
        <Button variant="link" onClick={handleChangeAddress}>
          Change address
        </Button>
        <Spacer />
      </>
    )
  }

  return (
    <>
      <Spacer />
      {address ? (
        <>
          <div className="mb-5">
            <p className="font-bold mb-1">Your address:</p>
            <FormattedAddress {...address} />
          </div>
          <Spacer />
          <SubmitButton onClick={handleConfirmAddress} isSubmitting={isLoading}>
            Confirm address
          </SubmitButton>
          <Button variant="link" onClick={handleChangeAddress}>
            Change address
          </Button>
        </>
      ) : (
        <>
          <p className="mb-2">
            Before we can start, we need a few pieces of info.
          </p>
          <p className="mb-6">First, what&apos;s your address?</p>
          <Autocomplete onPlaceSelected={handleOnPlaceSelected} />
        </>
      )}
      <Spacer />
    </>
  )
}

export default AddressPage
