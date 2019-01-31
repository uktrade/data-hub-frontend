const { startsWith, find, get, filter } = require('lodash')
const { setLocalNav } = require('../../middleware')

function setInvestmentsLocalNav (req, res, next, LOCAL_NAV, filterNonPermittedItem) {
  const { project_code: projectCode } = res.locals.investment
  const isLegacyProject = startsWith(projectCode, 'DHP')
  const documentsLabel = get(find(LOCAL_NAV, { 'path': 'documents' }), 'label')
  const userPermissions = get(res, 'locals.user.permissions')
  const navItems = filter(LOCAL_NAV, (item) => item.label === documentsLabel && isLegacyProject
    ? false
    : filterNonPermittedItem(userPermissions)(item)
  ) // _.filter() does not mutate the array as opposed to _.remove()
  setLocalNav(navItems)(req, res, next)
  return navItems
}

module.exports = setInvestmentsLocalNav
