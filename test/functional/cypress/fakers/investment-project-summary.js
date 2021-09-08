import faker from 'faker'
import { snakeCase } from 'lodash'

import { INVESTMENT_PROJECT_STAGES_LIST } from './constants'

/**
 * Generate fake data for annual summary totals.
 */
const investmentProjectSummaryFaker = () =>
  Object.fromEntries(
    INVESTMENT_PROJECT_STAGES_LIST.map((stage) => [
      snakeCase(stage.name),
      {
        label: stage.name,
        id: stage.id,
        value: faker.datatype.number({ min: 0, max: 50 }),
      },
    ])
  )

export { investmentProjectSummaryFaker }

export default investmentProjectSummaryFaker
