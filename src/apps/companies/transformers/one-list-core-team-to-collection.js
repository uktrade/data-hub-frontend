const { get } = require('lodash')
const isAccountManager = adviser => adviser.is_global_account_manager
const isAdviser = adviser => !adviser.is_global_account_manager

module.exports = function transformOneListCoreTeamToCollection (advisers) {
  const mapAdviser = ({ adviser }) => {
    const { name, dit_team: team } = adviser
    return {
      name,
      team: team.name,
      location: get(team, 'uk_region.name', team.country),
    }
  }

  const accountManagers = advisers
    .filter(isAccountManager)
    .map(mapAdviser)

  const teamMembers = advisers
    .filter(isAdviser)
    .map(mapAdviser)

  return {
    accountManagers,
    teamMembers,
  }
}
