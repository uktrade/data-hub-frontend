const { get } = require('lodash')

const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

function setCompaniesLocalNav (req, res, next) {
  const company = get(res.locals, 'company')

  if (!company) { next() }

  const headquarterType = get(company, 'headquarter_type.name')
  const navItems = !headquarterType ? LOCAL_NAV.filter(navItem => navItem.path !== 'subsidiaries') : LOCAL_NAV
  setLocalNav(navItems)(req, res, next)
}

module.exports = setCompaniesLocalNav
