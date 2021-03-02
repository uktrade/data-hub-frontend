import { get } from 'lodash'

/**
 * Converts investment summary received by the API into data ranges
 * that the chart component can work with
 */
export const investmentSummaryAsDataRanges = (investmentSummary) => {
  const annualSummaries = get(investmentSummary, 'annual_summaries', [])
  const adviserId = get(investmentSummary, 'adviser_id')

  return annualSummaries.map(({ financial_year, totals }) => {
    const now = new Date()
    const { start, end } = financial_year
    const label =
      new Date(start) <= now && new Date(end) >= now
        ? 'Current financial year'
        : financial_year.label
    return {
      label,
      name: financial_year.start,
      range: Object.entries(totals).map(([, props]) => ({
        ...props,
        link: `/investments/projects?stage=${props.id}&adviser=${adviserId}`,
      })),
    }
  })
}
