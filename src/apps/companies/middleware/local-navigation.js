/* eslint-disable camelcase */
const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

function setCompaniesLocalNav (req, res, next) {
  const { company } = res.locals

  const navItems = LOCAL_NAV.filter(({ path }) => {
    return (path !== 'advisers' || company.one_list_group_tier)
  })

  setLocalNav(navItems)(req, res, next)
}

module.exports = setCompaniesLocalNav
