import { fetchApi } from '@/utils'
import { useEffect, useState } from 'react'

const useBatteryStatus = () => {
  const [chargeState, setChargeState] = useState<any>(null)

  useEffect(() => {
    const getBatteryStatus = async () => {
      const { data: status, error } = await fetchApi(`/batteries/status`)
      const {
        data: { chargeState },
      } = status ?? { data: {} }
      setChargeState(chargeState)
    }
    getBatteryStatus()
    const interval = setInterval(getBatteryStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  return chargeState
}

export default useBatteryStatus
