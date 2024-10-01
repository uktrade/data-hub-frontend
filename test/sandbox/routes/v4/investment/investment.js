import incompleteLargeCapitalOpportunity from '../../../fixtures/v4/investment/large-capital-opportunity-incomplete.json' assert { type: 'json' }
import completeLargeCapitalOpportunity from '../../../fixtures/v4/investment/large-capital-opportunity-complete.json' assert { type: 'json' }
import largeCapitalOpportunityList from '../../../fixtures/v4/investment/large-capital-opportunity-list.json' assert { type: 'json' }
import largeCapitalOpportunityListOnePage from '../../../fixtures/v4/investment/large-capital-opportunity-list-one-page.json' assert { type: 'json' }
import eybLeadList from '../../../fixtures/v4/investment/eyb-lead-list.json' assert { type: 'json' }

export const getLargeCapitalOpportunity = function (req, res) {
  if (req.params.opportunityId == completeLargeCapitalOpportunity.id) {
    res.json(completeLargeCapitalOpportunity)
  } else {
    res.json(incompleteLargeCapitalOpportunity)
  }
}

export const getLargeCapitalOpportunityList = function (req, res) {
  if (req.body.sortby == 'name:asc') {
    return res.json(largeCapitalOpportunityListOnePage)
  }
  res.json(largeCapitalOpportunityList)
}

export const saveOpportunityDetails = function (req, res) {
  res.json(completeLargeCapitalOpportunity)
}

export const getEYBLead = function (req, res) {
  res.json(eybLeadList.results[0])
}

export const getEYBLeadList = function (req, res) {
  res.json(eybLeadList)
}
