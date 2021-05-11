var incompleteLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-incomplete.json')
var completeLargeCapitalOpportunity = require('../../../fixtures/v4/investment/large-capital-opportunity-complete.json')
var largeCapitalOpportunityList = require('../../../fixtures/v4/investment/large-capital-opportunity-list.json')
var largeCapitalOpportunityListOnePage = require('../../../fixtures/v4/investment/large-capital-opportunity-list-one-page.json')

exports.getLargeCapitalOpportunity = function (req, res) {
  if (req.params.opportunityId == completeLargeCapitalOpportunity.id) {
    res.json(completeLargeCapitalOpportunity)
  } else {
    res.json(incompleteLargeCapitalOpportunity)
  }
}

exports.getLargeCapitalOpportunityList = function (req, res) {
  if (req.body.sortby == 'name:asc') {
    return res.json(largeCapitalOpportunityListOnePage)
  }
  res.json(largeCapitalOpportunityList)
}
