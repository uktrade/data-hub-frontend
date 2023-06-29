/* eslint-disable camelcase */

const { setLocalNav } = require('../../../middleware')
const { getGlobalUltimate, getRelatedCompaniesCount } = require('./repos')
const urls = require('../../../../lib/urls')
const { get } = require('lodash')

function setCompanyHierarchyLocalNav(req, res, next) {
  const { company } = res.locals

  if (company.isUltimate && company.isGlobalHQ) {
    const navItems = [
      {
        url: urls.companies.dnbHierarchy.index(company.id),
        label: 'Dun & Bradstreet hierarchy',
        permissions: ['company.view_company'],
      },
      {
        url: urls.companies.subsidiaries.index(company.id),
        label: 'Manually linked subsidiaries',
        permissions: ['company.view_company'],
      },
    ]
    setLocalNav(navItems, false)(req, res, next)
  } else {
    setLocalNav()(req, res, next)
  }
}

async function getDnbHierarchyDetails(req, company) {
  if (company.duns_number && company.global_ultimate_duns_number) {
    const dnbRelatedCompaniesCount = await getRelatedCompaniesCount(
      req,
      company.id
    )
    const globalUltimate = await getGlobalUltimate(
      req,
      company.global_ultimate_duns_number
    )
    const globalUltimateResult = get(globalUltimate, 'results[0]')
    return {
      globalUltimate: globalUltimateResult && {
        ...globalUltimateResult,
        url: urls.companies.detail(globalUltimateResult.id),
      },
      dnbRelatedCompaniesCount: dnbRelatedCompaniesCount,
    }
  }

  return {
    dnbRelatedCompaniesCount: 0,
  }
}

async function setDnbHierarchyDetails(req, res, next) {
  const { company } = res.locals

  const { globalUltimate, dnbRelatedCompaniesCount } =
    await getDnbHierarchyDetails(req, company)
  res.locals.globalUltimate = globalUltimate
  res.locals.dnbHierarchyCount = dnbRelatedCompaniesCount + 1 //TODO these 2 variables can be refactored into a single but they are used across many components so a lot of files will change
  res.locals.dnbRelatedCompaniesCount = dnbRelatedCompaniesCount
  next()
}

module.exports = {
  setDnbHierarchyDetails,
  setCompanyHierarchyLocalNav,
}
