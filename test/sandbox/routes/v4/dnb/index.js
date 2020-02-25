var companyCreate = require('../../../fixtures/v4/dnb/company-create.json')
var companySearch = require('../../../fixtures/v4/dnb/company-search.json')
var companySearchMatched = require('../../../fixtures/v4/dnb/company-search-matched.json')
var companySearchNotMatched = require('../../../fixtures/v4/dnb/company-search-not-matched.json')
var companyCreateInvestigation = require('../../../fixtures/v4/dnb/company-create-investigation.json')

exports.companyCreate = function(req, res) {
  if (req.body.duns_number === '111111111') {
    res.json(companyCreate)
  }
}

exports.companySearch = function(req, res) {
  if (req.body.duns_number === '111111111') {
    return res.json(companySearchNotMatched)
  } else if (req.body.duns_number === '222222222') {
    return res.json(companySearchMatched)
  }
  return res.json(companySearch)
}

exports.companyCreateInvestigation = function(req, res) {
  res.json(companyCreateInvestigation)
}
