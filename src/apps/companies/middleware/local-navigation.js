const { get } = require('lodash')

const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

function setCompaniesLocalNav (req, res, next) {
  const company = get(res.locals, 'company')

  if (!company) { next() }

  const headquarterType = get(company, 'headquarter_type.name')
  const companyNumber = get(company, 'company_number')

  const navItems = LOCAL_NAV.filter((navItem) => {
    return (navItem.path !== 'subsidiaries' || headquarterType === 'ghq') &&
        (navItem.path !== 'timeline' || companyNumber) &&
        (navItem.path !== 'advisers' || res.locals.features['companies-advisers'])
  })

  setLocalNav(navItems)(req, res, next)
}

module.exports = setCompaniesLocalNav
