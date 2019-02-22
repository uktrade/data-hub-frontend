/* eslint-disable camelcase */
const { get, compact } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { accountManagementDisplayLabels } = require('../labels')
const { NONE_TEXT } = require('../constants')

const transformGlobalAccountManager = ({ dit_team, name }) => {
  const region = get(dit_team, 'uk_region.name')
  const country = get(dit_team, 'country.name')
  const items = compact([
    name,
    get(dit_team, 'name'),
    region || country,
  ])

  return items.length ? items : NONE_TEXT
}

module.exports = ({
  one_list_group_global_account_manager,
  one_list_group_tier,
}) => {
  if (one_list_group_tier) {
    const viewRecord = {
      one_list_group_global_account_manager: transformGlobalAccountManager(one_list_group_global_account_manager || {}),
      one_list_tier: one_list_group_tier.name,
    }

    return getDataLabels(viewRecord, accountManagementDisplayLabels)
  }
}
