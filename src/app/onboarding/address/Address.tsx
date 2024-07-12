import { Address } from '@/flip-api/types'

const FormattedAddress = (address: Address) => {
  return (
    <>
      <p>
        {address.street_number} {address.street_name}
      </p>
      <p>
        {address.city}, {address.state} {address.zip_code}
      </p>
    </>
  )
}

export default FormattedAddress
