var incompleteLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-incomplete.json')
var completeLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-complete.json')

exports.getLargeCapitalOpportunity = function (req, res) {
  if (req.params.opportunityId == completeLargeCapitalOpportunity.id) {
    res.json(completeLargeCapitalOpportunity)
  } else {
    res.json(incompleteLargeCapitalOpportunity)
  }
}
