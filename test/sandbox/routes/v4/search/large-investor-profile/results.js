var largeCapitalProfile = require('./../../../../fixtures/v4/investment/large-capital-profile-list10.json')

exports.largeInvestorProfile = function (req, res) {
  const countryOfOriginFilter = req.body.country_of_origin || []
  const filtered = largeCapitalProfile.results.filter(({ country_of_origin }) =>
    countryOfOriginFilter.length
      ? countryOfOriginFilter.includes(country_of_origin)
      : true
  )
  res.json({
    count: filtered.length,
    results: filtered,
  })
}
