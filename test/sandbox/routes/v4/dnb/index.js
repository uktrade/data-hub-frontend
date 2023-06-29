var companyCreate = require('../../../fixtures/v4/dnb/company-create.json')
var companySearch = require('../../../fixtures/v4/dnb/company-search.json')
var companyLink = require('../../../fixtures/v4/dnb/company-link.json')
var companyChangeRequest = require('../../../fixtures/v4/dnb/company-change-request.json')
var companySearchMatched = require('../../../fixtures/v4/dnb/company-search-matched.json')
var companySearchNotMatched = require('../../../fixtures/v4/dnb/company-search-not-matched.json')
var companySearchNotMatchedNoCountry = require('../../../fixtures/v4/dnb/company-search-not-matched-no-country.json')
var companySearchNotMatchedUS = require('../../../fixtures/v4/dnb/company-search-not-matched-us.json')
var companyInvestigation = require('../../../fixtures/v4/dnb/company-investigation.json')
var dnbGlobalUltimate = require('../../../fixtures/v4/company/company-dnb-global-ultimate.json')

const { fakerCompanyFamilyTree } = require('./company-tree')

exports.companyCreate = function (req, res) {
  if (req.body.duns_number === '111111111') {
    res.json(companyCreate)
  }
}

exports.companySearch = function (req, res) {
  if (req.body.search_term === 'Simulate 500 Error') {
    return res.sendStatus(500)
  }

  if (req.body.duns_number === '268435455') {
    return res.json(companySearchNotMatchedUS)
  } else if (req.body.duns_number === '111111111') {
    return res.json(companySearchNotMatched)
  } else if (req.body.duns_number === '222222222') {
    return res.json(companySearchMatched)
  } else if (req.body.duns_number === '333333333') {
    return res.json(companySearchNotMatchedNoCountry)
  }

  return res.json(companySearch)
}

exports.companyInvestigation = function (req, res) {
  res.json(companyInvestigation)
}

exports.companyLink = function (req, res) {
  res.json(companyLink)
}

exports.companyChangeRequest = function (req, res) {
  res.json(companyChangeRequest)
}

exports.companyFamilyTree = function (req, res) {
  res.json(
    fakerCompanyFamilyTree({
      treeDepth: 3,
      minCompaniesPerLevel: 1,
      maxCompaniesPerLevel: 5,
    })
  )
}

exports.relatedCompaniesCount = function (req, res) {
  res.json(req.params.companyId === dnbGlobalUltimate.id ? 5 : 0)
}
