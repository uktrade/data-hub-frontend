import companyCreateJson from '../../../fixtures/v4/dnb/company-create.json' assert { type: 'json' };
import companySearchJson from '../../../fixtures/v4/dnb/company-search.json' assert { type: 'json' };
import companyLinkJson from '../../../fixtures/v4/dnb/company-link.json' assert { type: 'json' };
import companyChangeRequestJson from '../../../fixtures/v4/dnb/company-change-request.json' assert { type: 'json' };
import companySearchMatched from '../../../fixtures/v4/dnb/company-search-matched.json' assert { type: 'json' };
import companySearchNotMatched from '../../../fixtures/v4/dnb/company-search-not-matched.json' assert { type: 'json' };
import companySearchNotMatchedNoCountry from '../../../fixtures/v4/dnb/company-search-not-matched-no-country.json' assert { type: 'json' };
import companySearchNotMatchedUSJson from '../../../fixtures/v4/dnb/company-search-not-matched-us.json' assert { type: 'json' };
import companyInvestigationJson from '../../../fixtures/v4/dnb/company-investigation.json' assert { type: 'json' };
import dnbGlobalUltimate from '../../../fixtures/v4/company/company-dnb-global-ultimate.json' assert { type: 'json' };
import { fakerCompanyFamilyTree } from './company-tree.js';

export const companyCreate = function (req, res) {
  if (req.body.duns_number === '111111111') {
    res.json(companyCreateJson)
  }
};

export const companySearch = function (req, res) {
  if (req.body.search_term === 'Simulate 500 Error') {
    return res.sendStatus(500)
  }

  if (req.body.duns_number === '268435455') {
    return res.json(companySearchNotMatchedUSJson)
  } else if (req.body.duns_number === '111111111') {
    return res.json(companySearchNotMatched)
  } else if (req.body.duns_number === '222222222') {
    return res.json(companySearchMatched)
  } else if (req.body.duns_number === '333333333') {
    return res.json(companySearchNotMatchedNoCountry)
  }

  return res.json(companySearchJson)
};

export const companyInvestigation = function (req, res) {
  res.json(companyInvestigationJson)
};

export const companyLink = function (req, res) {
  res.json(companyLinkJson)
};

export const companyChangeRequest = function (req, res) {
  res.json(companyChangeRequestJson)
};

export const companyFamilyTree = function (req, res) {
  res.json(
    fakerCompanyFamilyTree({
      treeDepth: 3,
      minCompaniesPerLevel: 1,
      maxCompaniesPerLevel: 5,
    })
  )
};

export const relatedCompaniesCount = function (req, res) {
  res.json(
    req.params.companyId === dnbGlobalUltimate.id
      ? {
          total: 5,
          related_companies_count: 3,
          manually_linked_subsidiaries_count: 2,
          reduced_tree: false,
        }
      : {
          total: 0,
          related_companies_count: 0,
          manually_linked_subsidiaries_count: 0,
          reduced_tree: false,
        }
  )
};

export const relatedCompanies = function (req, res) {
  res.json({
    related_companies: [],
    reduced_tree: false,
  })
};
