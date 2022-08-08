const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

const DHP = 'DHP'
const DOCUMENTS = 'documents'

const isProjectNew = (investment) => investment.project_code.startsWith(DHP)

const filterDocNavItemIfProjectIsNew = (investment) => {
  const isNew = isProjectNew(investment)
  return LOCAL_NAV.filter(({ path }) => !(path === DOCUMENTS && isNew))
}

const setLocalNavigation = (req, res, next) => {
  const { investment } = res.locals
  const navItems = investment
    ? filterDocNavItemIfProjectIsNew(investment)
    : LOCAL_NAV
  setLocalNav(navItems)(req, res, next)
}

module.exports = setLocalNavigation
