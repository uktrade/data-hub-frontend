/* eslint-disable camelcase */
const { get } = require('lodash')

const { setLocalNav } = require('../../middleware')
const { DEPRECATED_LOCAL_NAV, LOCAL_NAV } = require('../constants')

function setCompaniesLocalNav (req, res, next) {
  const { company, features } = res.locals

  if (company.duns_number || features['companies-new-layout']) {
    const navItems = LOCAL_NAV.filter(({ path }) => {
      return (path !== 'advisers' || company.one_list_group_tier)
    })

    setLocalNav(navItems)(req, res, next)
  } else {
    const headquarterType = get(company, 'headquarter_type.name')

    const navItems = DEPRECATED_LOCAL_NAV.filter(({ path }) => {
      return (path !== 'subsidiaries' || headquarterType === 'ghq') &&
        (path !== 'timeline' || company.company_number) &&
        (path !== 'advisers' || company.one_list_group_tier)
    })

    setLocalNav(navItems)(req, res, next)
  }
}

module.exports = setCompaniesLocalNav
