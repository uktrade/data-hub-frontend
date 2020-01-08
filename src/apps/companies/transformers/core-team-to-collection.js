const { get, compact } = require('lodash')

const { coreTeamLabels } = require('../labels')

function getSubTitle(isGlobalAccountManager) {
  return isGlobalAccountManager
    ? { value: 'Global Account Manager' }
    : undefined
}

module.exports = function transformCoreTeamToCollection(advisers) {
  return advisers.map(
    ({ adviser, is_global_account_manager: isGlobalAccountManager }) => {
      const region = get(adviser, 'dit_team.uk_region.name')
      const metaItems = [
        region ? { label: coreTeamLabels.region, value: region } : null,
        {
          label: coreTeamLabels.country,
          value: get(adviser, 'dit_team.country.name'),
        },
        { label: coreTeamLabels.team, value: get(adviser, 'dit_team.name') },
      ]

      return {
        name: adviser.name,
        type: 'adviser',
        subTitle: getSubTitle(isGlobalAccountManager),
        meta: compact(metaItems),
      }
    }
  )
}
