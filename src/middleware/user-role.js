const { get } = require('lodash')

const urls = require('../lib/urls')

const ITA_TEAM_ROLES = [
  'International Trade Team',
  'International Trade Director',
]

module.exports = (req, res, next) => {
  // Not all users are assigned a team and some teams do not have a role
  const ditTeamRole = get(res, 'locals.user.dit_team.role')

  const isITA = ITA_TEAM_ROLES.includes(ditTeamRole?.name)
  const isFeatureTesting = get(res, 'locals.isFeatureTesting')
  const isComingFromDashboard = req.originalUrl === urls.dashboard()

  return isFeatureTesting && isITA && isComingFromDashboard
    ? res.redirect(urls.exportPipeline.index())
    : next()
}
