import { get } from 'lodash'
import { addYears, subYears } from 'date-fns'

/**
 * Converts investment summary received by the API into data ranges
 * that the chart component can work with
 */
export const investmentSummaryAsDataRanges = (investmentSummary) => {
  const annualSummaries = get(investmentSummary, 'annual_summaries', [])
  const adviserId = get(investmentSummary, 'adviser_id')

  const labelledSummaries = annualSummaries.map(
    ({ financial_year, totals }) => {
      const { start, end } = financial_year
      const startDate = new Date(start)
      const endDate = new Date(end)

      const now = new Date()
      const oneYearAgo = subYears(now, 1)
      const oneYearAhead = addYears(now, 1)

      let label, order
      if (startDate <= now && endDate >= now) {
        label = `Current financial year (${financial_year.label})`
        order = 0
      } else if (startDate <= oneYearAgo && endDate >= oneYearAgo) {
        label = `Previous financial year (${financial_year.label})`
        order = 1
      } else if (startDate <= oneYearAhead && endDate >= oneYearAhead) {
        label = 'Upcoming financial year'
        order = 2
      } else {
        label = financial_year.label
        order = 3
      }

      return {
        label,
        order,
        name: financial_year.start,
        range: Object.entries(totals).map(([, props]) => ({
          ...props,
          link: `/investments/projects?stage=${props.id}&adviser=${adviserId}`,
        })),
      }
    }
  )

  return labelledSummaries
    .sort((a, b) => a.order > b.order)
    .map(({ order, ...rest }) => ({ ...rest }))
}
