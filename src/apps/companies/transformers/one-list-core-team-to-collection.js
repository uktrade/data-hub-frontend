const { get } = require('lodash')

const isAccountManager = (adviser) => adviser.is_global_account_manager
const isAdviser = (adviser) => !adviser.is_global_account_manager

module.exports = (advisers) => {
  const mapAdviser = ({ adviser }) => {
    const country = get(adviser.dit_team, 'country.name')
    const location = get(adviser.dit_team, 'uk_region.name', country)

    return {
      name: adviser.name,
      team: adviser.dit_team.name,
      location,
    }
  }

  const accountManagers = advisers.filter(isAccountManager).map(mapAdviser)

  const teamMembers = advisers.filter(isAdviser).map(mapAdviser)

  return {
    accountManagers,
    teamMembers,
  }
}
