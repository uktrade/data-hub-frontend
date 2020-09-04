var largeCapitalProfile = require('./../../../../fixtures/v4/company/large-capital-profile.json')

exports.largeInvestorProfile = function (req, res) {
  res.json(largeCapitalProfile)
}
