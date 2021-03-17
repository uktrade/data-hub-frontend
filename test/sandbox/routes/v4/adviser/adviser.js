const investmentSummary = require('../../../fixtures/v4/adviser/investment-summary.json')

exports.investmentSummary = function (req, res) {
  const { annual_summaries, ...rest } = investmentSummary
  const now = new Date()
  const currentFinancialYearStart =
    now.getMonth() < 4 ? now.getFullYear() - 1 : now.getFullYear()
  const currentInvestmentSummary = {
    annual_summaries: annual_summaries.map(
      ({ financial_year, ...annualSummaryProps }, i) => {
        const startYear = currentFinancialYearStart + 1 - i
        return {
          financial_year: {
            label: `${startYear}-${(startYear + 1).toString().slice(-2)}`,
            start: `${startYear}-04-01`,
            end: `${startYear + 1}-03-31`,
          },
          ...annualSummaryProps,
        }
      }
    ),
    ...rest,
  }
  res.json(currentInvestmentSummary)
}
