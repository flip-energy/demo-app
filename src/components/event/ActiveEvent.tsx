'use client'

import {
  ChevronRightIcon,
  HomeIcon,
  UtilityPoleIcon,
  ZapIcon,
} from 'lucide-react'
import TimeLeft from '../TimeLeft'
import useBatteryStatus from '@/hooks/useBatteryStatus'
import { capitalizeString } from '@/utils'

const ActiveEvent = ({ event }: { event: any }) => {
  // const chargeState = useBatteryStatus()

  return (
    <div className="flex flex-col bg-gray-50 p-5 border border-black rounded-md flex-1 space-y-1">
      <div
        className={`flex ${
          // chargeState && ' pb-4 mb-4 border-b border-gray-200'
          ''
        }`}
      >
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex space-x-1">
            <span>Active event</span>
            <span>&middot;</span>
            <TimeLeft endTime={event.ends_at} />
          </div>
          {/* {chargeState && (
            <div className="text-gray-500 flex items-center">
              <ZapIcon size={16} className="mr-1" />
              {capitalizeString(chargeState.status)}
            </div>
          )} */}
        </div>
        <div className="flex-1 flex justify-end items-center text-gray-500">
          <ChevronRightIcon size={16} />
        </div>
      </div>
      {/* {chargeState && (
        <div className="flex">
          <div className="flex items-center justify-around">
            <HomeIcon size={20} />
            <div className="block h-[1px] w-10 my-auto mx-2 animate-gradient bg-[linear-gradient(to_right,theme(colors.green.500),black,black,theme(colors.green.500))] bg-[length:_200%_auto] "></div>
            <span className="text-md">{chargeState.chargeRate} kW</span>
            <div className="block h-[1px] w-10 my-auto mx-2 animate-gradient bg-[linear-gradient(to_right,theme(colors.green.500),black,black,theme(colors.green.500))] bg-[length:_200%_auto] "></div>{' '}
            <UtilityPoleIcon size={20} />
          </div>
        </div>
      )} */}
    </div>
  )
}

export default ActiveEvent
