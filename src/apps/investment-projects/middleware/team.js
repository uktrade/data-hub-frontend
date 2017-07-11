const { transformBriefInvestmentSummary } = require('../services/formatting')

function getBriefInvestmentSummary (req, res, next) {
  try {
    res.locals.briefInvestmentSummaryData = transformBriefInvestmentSummary(res.locals.investmentData)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBriefInvestmentSummary,
}
