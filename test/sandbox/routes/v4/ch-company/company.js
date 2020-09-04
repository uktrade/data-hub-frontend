var mercuryTradingLtd = require('../../../fixtures/v4/ch-company/mercury-trading-ltd.json')

exports.company = function (req, res) {
  var companies = {
    99919: mercuryTradingLtd,
  }

  res.json(companies[req.params.companyId])
}
