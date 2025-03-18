import mercuryTradingLtd from '../../../fixtures/v4/ch-company/mercury-trading-ltd.json' with { type: 'json' }

export const company = function (req, res) {
  var companies = {
    99919: mercuryTradingLtd,
  }

  res.json(companies[req.params.companyId])
}
