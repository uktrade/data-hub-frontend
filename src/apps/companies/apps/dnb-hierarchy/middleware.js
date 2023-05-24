/* eslint-disable camelcase */

const { setLocalNav } = require('../../../middleware')
const urls = require('../../../../lib/urls')

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

module.exports = {
  setCompanyHierarchyLocalNav,
}
