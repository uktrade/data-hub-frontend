import companiesJson from '../../../fixtures/v3/search/company.json' assert { type: 'json' };
import companyWithAttributesJson from '../../../fixtures/v3/search/company-with-attributes.json' assert { type: 'json' };
import companyFilterJson from '../../../fixtures/v3/search/filter/company-filter.json' assert { type: 'json' };
import companySortByMostRecentJson from '../../../fixtures/v3/search/sort/company-sort-by-most-recent.json' assert { type: 'json' };
import companySortByLeastRecentJson from '../../../fixtures/v3/search/sort/company-sort-by-least-recent.json' assert { type: 'json' };
import companySortByAZJson from '../../../fixtures/v3/search/sort/company-sort-by-a-z.json' assert { type: 'json' };

export const companies = function (req, res) {
  var companiesList = {
    collectionTest: companyWithAttributesJson,
    'modified_on:desc': companySortByMostRecentJson,
    'modified_on:asc': companySortByLeastRecentJson,
    'name:asc': companySortByAZJson,
  }

  if (
    req.body.name === 'FilterByCompany' ||
    req.body.archived === 'false' ||
    req.body.archived === 'true' ||
    req.body.country === '87756b9a-5d95-e211-a939-e4115bead28a' ||
    req.body.uk_region === '934cd12a-6095-e211-a939-e4115bead28a'
  ) {
    return res.json(companyFilterJson)
  }

  res.json(companiesList[req.body.sortby] || companiesJson)
};
