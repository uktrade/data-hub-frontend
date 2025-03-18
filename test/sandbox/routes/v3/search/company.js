import companies from '../../../fixtures/v3/search/company.json' with { type: 'json' }
import companyWithAttributes from '../../../fixtures/v3/search/company-with-attributes.json' with { type: 'json' }
import companyFilter from '../../../fixtures/v3/search/filter/company-filter.json' with { type: 'json' }
import companySortByMostRecent from '../../../fixtures/v3/search/sort/company-sort-by-most-recent.json' with { type: 'json' }
import companySortByLeastRecent from '../../../fixtures/v3/search/sort/company-sort-by-least-recent.json' with { type: 'json' }
import companySortByAZ from '../../../fixtures/v3/search/sort/company-sort-by-a-z.json' with { type: 'json' }

export const getCompanies = function (req, res) {
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
