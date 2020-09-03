var companies = require('../../../fixtures/v3/search/company.json')
var companyWithAttributes = require('../../../fixtures/v3/search/company-with-attributes.json')
var companyFilter = require('../../../fixtures/v3/search/filter/company-filter.json')
var companySortByMostRecent = require('../../../fixtures/v3/search/sort/company-sort-by-most-recent.json')
var companySortByLeastRecent = require('../../../fixtures/v3/search/sort/company-sort-by-least-recent.json')
var companySortByAZ = require('../../../fixtures/v3/search/sort/company-sort-by-a-z.json')

exports.companies = function (req, res) {
  var companiesList = {
    collectionTest: companyWithAttributes,
    'modified_on:desc': companySortByMostRecent,
    'modified_on:asc': companySortByLeastRecent,
    'name:asc': companySortByAZ,
  }

  if (
    req.body.name === 'FilterByCompany' ||
    req.body.archived === 'false' ||
    req.body.archived === 'true' ||
    req.body.country === '87756b9a-5d95-e211-a939-e4115bead28a' ||
    req.body.uk_region === '934cd12a-6095-e211-a939-e4115bead28a'
  ) {
    return res.json(companyFilter)
  }

  res.json(companiesList[req.body.sortby] || companies)
}
