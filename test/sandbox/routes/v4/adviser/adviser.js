const investmentSummary = require('../../../fixtures/v4/adviser/investment-summary.json')

exports.investmentSummary = function (req, res) {
  res.json(investmentSummary)
}
