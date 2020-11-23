var companies = require('../../../fixtures/v4/search/company.json')
var companyWithAttributes = require('../../../fixtures/v4/search/company-with-attributes.json')
var companyFilter = require('../../../fixtures/v4/search/filter/company-filter.json')
var companySortByMostRecent = require('../../../fixtures/v4/search/sort/company-sort-by-most-recent.json')
var companySortByLeastRecent = require('../../../fixtures/v4/search/sort/company-sort-by-least-recent.json')
var companySortByAZ = require('../../../fixtures/v4/search/sort/company-sort-by-a-z.json')

exports.companies = function (req, res) {
  var companiesList = {
    collectionTest: companyWithAttributes,
    'modified_on:desc': companySortByMostRecent,
    'modified_on:asc': companySortByLeastRecent,
    'name:asc': companySortByAZ,
  }

  if (req.body.uk_postcode) {
    var postcodeFilteredResults = _.filter(
      companies.results,
      function (company) {
        return _.startsWith(
          _.get(company, 'registered_address.postcode'),
          req.body.uk_postcode
        )
      }
    )
    return res.json({
      count: postcodeFilteredResults.length,
      results: postcodeFilteredResults,
    })
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
