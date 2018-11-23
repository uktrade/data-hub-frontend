/* eslint-disable camelcase */
const { get, compact } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { accountManagementDisplayLabels } = require('../labels')

const NONE_TEXT = 'None'

const transformOneListAccountOwner = (globalAccountManager) => {
  const region = get(globalAccountManager, 'adviser.dit_team.uk_region.name')
  const country = get(globalAccountManager, 'adviser.dit_team.country.name')
  const items = compact([
    get(globalAccountManager, 'adviser.name'),
    get(globalAccountManager, 'adviser.dit_team.name'),
    region || country,
  ])

  return items.length ? items : NONE_TEXT
}

module.exports = function transformCompanyToOneListView (company, globalAccountManager) {
  const viewRecord = {
    one_list_account_owner: transformOneListAccountOwner(globalAccountManager),
    one_list_tier: get(company, 'one_list_group_tier.name', NONE_TEXT),
  }

  return getDataLabels(viewRecord, accountManagementDisplayLabels)
}
