/* eslint-disable camelcase */

const { setLocalNav } = require('../../../middleware')
const urls = require('../../../../lib/urls')

function setSubsidiariesLocalNav (req, res, next) {
  const { company, features } = res.locals

  const isGlobalHQ = company.headquarter_type && company.headquarter_type.name === 'ghq'

  if (features['companies-ultimate-hq'] && company.is_global_ultimate && isGlobalHQ) {
    const navItems = [
      {
        url: urls.companies.dnbSubsidiaries.index(company.id),
        label: 'Dun & Bradstreet hierarchy',
        permissions: [
          'company.view_company',
        ],
      },
      {
        url: urls.companies.subsidiaries.index(company.id),
        label: 'Manually linked subsidiaries',
        permissions: [
          'company.view_company',
        ],
      },
    ]
    setLocalNav(navItems, false)(req, res, next)
  } else {
    setLocalNav()(req, res, next)
  }
}

module.exports = {
  setSubsidiariesLocalNav,
}
