import { snakeCase } from 'lodash'

import { faker } from '../../../sandbox/utils/random'

import { INVESTMENT_PROJECT_STAGES_LIST } from './constants'

/**
 * Generate fake data for annual summary totals.
 */
const investmentProjectSummaryFaker = ({ minValue = 0, maxValue = 50 } = {}) =>
  Object.fromEntries(
    INVESTMENT_PROJECT_STAGES_LIST.map((stage) => [
      snakeCase(stage.name),
      {
        label: stage.name,
        id: stage.id,
        value: faker.number.int({ min: minValue, max: maxValue }),
      },
    ])
  )

export { investmentProjectSummaryFaker }

export default investmentProjectSummaryFaker
