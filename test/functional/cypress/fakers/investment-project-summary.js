import faker from 'faker'
import { snakeCase } from 'lodash'

import { investmentProjectStages } from './constants'
import {
  generateFinancialYearLabel,
  getFinancialYearStart,
} from '../../../../src/client/utils/date-utils'

// Adviser id is currently set in the node layer, so we have to set to the
// value in sandbox
const MY_ADVISER_ID = '7d19d407-9aec-4d06-b190-d3f404627f21'

/**
 * Generate financial year object given the start year.
 */
const financialYearGenerator = (startYear) => ({
  label: generateFinancialYearLabel(startYear),
  start: `${startYear}-04-01`,
  end: `${startYear + 1}-03-31`,
})

/**
 * Generate fake data for annual summary totals.
 */
const annualSummaryTotalsFaker = () =>
  Object.fromEntries(
    investmentProjectStages.map((stage) => [
      snakeCase(stage.name),
      {
        label: stage.name,
        id: faker.datatype.uuid(),
        value: faker.datatype.number({ min: 0, max: 50 }),
      },
    ])
  )

/**
 * Generate fake data for an annual summary.
 */
const annualSummaryFaker = (startYear) => ({
  financial_year: financialYearGenerator(startYear),
  totals: annualSummaryTotalsFaker(),
})

/**
 * Generate fake data for an investment project summary.
 */
const investmentProjectSummaryFaker = (overrides = {}) => {
  const currentFinancialYearStart = getFinancialYearStart(new Date())

  return {
    annual_summaries: [
      currentFinancialYearStart - 1,
      currentFinancialYearStart,
      currentFinancialYearStart + 1,
    ].map((startYear) => annualSummaryFaker(startYear)),
    adviser_id: MY_ADVISER_ID,
    ...overrides,
  }
}

export { investmentProjectSummaryFaker }

export default investmentProjectSummaryFaker
