import { Program } from '@/flip-api/types'
import { formatMoney, getMonthRange } from '@/utils'

class ProgramDecorator {
  model: Program

  constructor(program: Program) {
    this.model = program
  }

  commitment(): string {
    return this.model.minimum_commitment_months > 0
      ? this._toYearsText(this.model.minimum_commitment_months / 12)
      : 'None'
  }

  earnings(): string {
    const earnings = []
    if (this.model.earnings_for_site_upfront) {
      earnings.push(
        `${formatMoney(this.model.earnings_for_site_upfront)} upfront`
      )
    }
    if (this.model.earnings_for_site_yearly) {
      earnings.push(
        `${formatMoney(this.model.earnings_for_site_yearly)} yearly`
      )
    }
    return earnings.length > 0 ? `Up to ${earnings.join(' and ')}` : ''
  }

  participation(): string {
    return getMonthRange(this.model.participation_months)
  }

  _toYearsText(years: number): string {
    return years > 1 ? years + ' years' : years + ' year'
  }
}

export default ProgramDecorator
