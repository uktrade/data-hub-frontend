import companyCreate from '../../../fixtures/v4/dnb/company-create.json' with { type: 'json' }
import companySearch from '../../../fixtures/v4/dnb/company-search.json' with { type: 'json' }
import companyLink from '../../../fixtures/v4/dnb/company-link.json' with { type: 'json' }
import companyChangeRequest from '../../../fixtures/v4/dnb/company-change-request.json' with { type: 'json' }
import companySearchMatched from '../../../fixtures/v4/dnb/company-search-matched.json' with { type: 'json' }
import companySearchNotMatched from '../../../fixtures/v4/dnb/company-search-not-matched.json' with { type: 'json' }
import companySearchNotMatchedNoCountry from '../../../fixtures/v4/dnb/company-search-not-matched-no-country.json' with { type: 'json' }
import companySearchNotMatchedUS from '../../../fixtures/v4/dnb/company-search-not-matched-us.json' with { type: 'json' }
import companyInvestigation from '../../../fixtures/v4/dnb/company-investigation.json' with { type: 'json' }
import dnbGlobalUltimate from '../../../fixtures/v4/company/company-dnb-global-ultimate.json' with { type: 'json' }

import { fakerCompanyFamilyTree } from './company-tree.js'

export const createDnbCompany = function (req, res) {
  if (req.body.duns_number === '111111111') {
    res.json(companyCreate)
  }
}

export const dnbCompanySearch = function (req, res) {
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

export const dnbCompanyInvestigation = function (req, res) {
  res.json(companyInvestigation)
}

export const dnbCompanyLink = function (req, res) {
  res.json(companyLink)
}

export const dnbCompanyChangeRequest = function (req, res) {
  res.json(companyChangeRequest)
}

export const companyFamilyTree = function (req, res) {
  res.json(
    fakerCompanyFamilyTree({
      treeDepth: 3,
      minCompaniesPerLevel: 1,
      maxCompaniesPerLevel: 5,
    })
  )
}

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
}

export const relatedCompanies = function (req, res) {
  res.json({
    related_companies: [],
    reduced_tree: false,
  })
}
