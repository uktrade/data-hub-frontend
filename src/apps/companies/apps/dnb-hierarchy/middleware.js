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

async function getDnbHierarchyDetails(req, dunsNumber, companyId) {
  if (dunsNumber) {
    const dnbHierarchyCount = await getRelatedCompaniesCount(req, companyId)
    const globalUltimate = await getGlobalUltimate(req, dunsNumber)
    const globalUltimateResult = get(globalUltimate, 'results[0]')

    return {
      globalUltimate: globalUltimateResult && {
        ...globalUltimateResult,
        url: urls.companies.detail(globalUltimateResult.id),
      },
      dnbHierarchyCount,
    }
  }

  return {
    dnbHierarchyCount: 0,
  }
}

async function setDnbHierarchyDetails(req, res, next) {
  const { company } = res.locals

  const { globalUltimate, dnbHierarchyCount } = await getDnbHierarchyDetails(
    req,
    company.global_ultimate_duns_number,
    company.id
  )
  res.locals.globalUltimate = globalUltimate
  res.locals.dnbHierarchyCount = dnbHierarchyCount
  res.locals.dnbRelatedCompaniesCount =
    dnbHierarchyCount > 1 ? dnbHierarchyCount - 1 : 0
  next()
}

module.exports = {
  setDnbHierarchyDetails,
  setCompanyHierarchyLocalNav,
}
