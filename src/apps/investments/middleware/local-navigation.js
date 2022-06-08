const { setLocalNav } = require('../../middleware')
const { LOCAL_NAV } = require('../constants')

const DHP = 'DHP'
const DOCUMENTS = 'documents'
const NOTIFICATIONS = 'notifications'

const isProjectNew = (investment) => investment.project_code.startsWith(DHP)

const filterDocNavItemIfProjectIsNew = (investment) => {
  const isNew = isProjectNew(investment)
  return LOCAL_NAV.filter(({ path }) => !(path === DOCUMENTS && isNew))
}

const filterNotificationNavItem = (
  items,
  user,
  investment,
  isFeatureTesting
) => {
  const isProjectManager = user?.id === investment?.project_manager?.id
  const isProjectAssuranceAdviser =
    user?.id === investment?.project_assurance_adviser?.id
  const isClientRelationshipManager =
    user?.id === investment?.client_relationship_manager?.id
  const isReferralSourceAdviser =
    user?.id === investment?.referral_source_adviser?.id
  const hasNotifications =
    (isProjectManager ||
      isProjectAssuranceAdviser ||
      isClientRelationshipManager ||
      isReferralSourceAdviser) &&
    isFeatureTesting

  if (!hasNotifications) {
    return items.filter(({ path }) => !(path === NOTIFICATIONS))
  }
  return items
}

const setLocalNavigation = (req, res, next) => {
  const { investment, isFeatureTesting } = res.locals
  const user = req.session?.user
  const navItems = investment
    ? filterDocNavItemIfProjectIsNew(investment)
    : LOCAL_NAV
  const items = filterNotificationNavItem(
    navItems,
    user,
    investment,
    isFeatureTesting
  )
  setLocalNav(items)(req, res, next)
}

module.exports = setLocalNavigation
