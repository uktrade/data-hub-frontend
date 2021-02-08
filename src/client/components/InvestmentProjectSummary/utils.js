/**
 * Converts annual investment summaries received by the API into data ranges
 * that the chart component can work with
 */
export const annualSummariesAsDataRanges = (annualSummaries) =>
  annualSummaries.map(({ financial_year, totals }) => {
    const now = new Date()
    let { label, start, end } = financial_year
    if (new Date(start) <= now && new Date(end) >= now) {
      label = 'Current financial year'
    }
    return {
      label: label,
      name: financial_year.start,
      range: Object.values(totals),
    }
  })
