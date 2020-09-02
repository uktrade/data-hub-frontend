/* eslint-disable camelcase */

const { setLocalNav } = require('../../../middleware')
const { getDnbHierarchy } = require('./repos')
const urls = require('../../../../lib/urls')

function setCompanyHierarchyLocalNav(req, res, next) {
  const { company, features } = res.locals

  if (
    features['companies-ultimate-hq'] &&
    company.isUltimate &&
    company.isGlobalHQ
  ) {
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

async function getDnbHierarchyDetails(req, dunsNumber) {
  if (dunsNumber) {
    const dnbHierarchy = await getDnbHierarchy(req, dunsNumber, 1)
    const dnbHierarchyCount = dnbHierarchy.count
    const globalUltimate = dnbHierarchy.results.find(
      (c) => c.is_global_ultimate
    )

    return {
      globalUltimate: globalUltimate && {
        ...globalUltimate,
        url: urls.companies.detail(globalUltimate.id),
      },
      dnbHierarchyCount,
    }
  }

  return {
    dnbHierarchyCount: 0,
  }
}

async function setDnbHierarchyDetails(req, res, next) {
  const { company, features } = res.locals

  if (features['companies-ultimate-hq']) {
    const { globalUltimate, dnbHierarchyCount } = await getDnbHierarchyDetails(
      req,
      company.global_ultimate_duns_number
    )

    res.locals.globalUltimate = globalUltimate
    res.locals.dnbHierarchyCount = dnbHierarchyCount
    res.locals.dnbRelatedCompaniesCount =
      dnbHierarchyCount > 1 ? dnbHierarchyCount - 1 : 0
  }

  next()
}

module.exports = {
  setDnbHierarchyDetails,
  setCompanyHierarchyLocalNav,
}
