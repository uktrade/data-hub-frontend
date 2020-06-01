const { NONE } = require('./constants')

const IGNORED_TIERS = ['1929c808-99b4-4abf-a891-45f2e187b410']

const filterOneListTiers = (tiers) => {
  return tiers
    .filter((tier) => !IGNORED_TIERS.includes(tier.value))
    .concat([{ value: NONE, label: 'Not on the One List' }])
}

const isGlobalAccountManager = (teamMember) =>
  teamMember.is_global_account_manager

const getTeamMembers = (team) => {
  return team
    .filter((teamMember) => !isGlobalAccountManager(teamMember))
    .map((a) => a.adviser)
}

module.exports = {
  filterOneListTiers,
  getTeamMembers,
}
