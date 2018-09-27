const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

function setLocalNavForApp (req, res, next) {
  const navItems = LOCAL_NAV.filter((navItem) => {
    return (navItem.path !== 'propositions' || res.locals.features['proposition-documents']) &&
      (navItem.path !== 'evidence' || res.locals.features['investment-evidence'])
  })

  setLocalNav(navItems)(req, res, next)
}

module.exports = {
  setLocalNavForApp,
}
