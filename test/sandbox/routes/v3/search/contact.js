var contacts = require('../../../fixtures/v3/search/contact.json')
var contactFilter = require('../../../fixtures/v3/search/filter/contact-filter.json')
var contactWithAttributes = require('../../../fixtures/v3/search/contact-with-attributes.json')
var contactSortBy = require('../../../fixtures/v3/search/sort/contact-sort-by.json')

exports.contacts = function (req, res) {
  var contactsList = {
    collectionTest: contactWithAttributes,
    'created_on:desc': contactSortBy,
    'created_on:asc': contactSortBy,
    'modified_on:desc': contactSortBy,
    'modified_on:asc': contactSortBy,
    'address_country.name:asc': contactSortBy,
    'company.name:asc': contactSortBy,
    'last_name:asc': contactSortBy,
  }
  if (req.body.company_uk_region) {
    var regionQuery = req.body.company_uk_region
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var ukRegionFilteredResults = _.filter(contacts.results, function (
      contact
    ) {
      return _.intersection(regions, [_.get(contact, 'company_uk_region.id')])
        .length
    })
    return res.json({
      count: ukRegionFilteredResults.length,
      results: ukRegionFilteredResults,
    })
  }

  if (
    req.body.name === 'FilterByContacts' ||
    req.body.archived === 'false' ||
    req.body.archived === 'true' ||
    req.body.address_country === '87756b9a-5d95-e211-a939-e4115bead28a' ||
    req.body.company_uk_region === '934cd12a-6095-e211-a939-e4115bead28a'
  ) {
    return res.json(contactFilter)
  }

  res.json(contactsList[req.body.sortby] || contacts)
}
