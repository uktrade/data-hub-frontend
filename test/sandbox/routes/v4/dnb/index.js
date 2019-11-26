var companyCreate = require('../../../fixtures/v4/dnb/company-create.json')
var companySearch = require('../../../fixtures/v4/dnb/company-search.json')
var companyCreateInvestigation = require('../../../fixtures/v4/dnb/company-create-investigation.json')

exports.companyCreate = function (req, res) {
  if (req.body.duns_number === '291332174') {
    res.json(companyCreate)
  }
}

exports.companySearch = function (req, res) {
  res.json(companySearch)
}

exports.companyCreateInvestigation = function (req, res) {
  res.json(companyCreateInvestigation)
}
