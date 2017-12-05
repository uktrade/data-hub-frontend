/* eslint-disable camelcase */
const { get } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { accountManagementDisplayLabels } = require('../labels')

module.exports = function transformCompanyToOneListView ({ one_list_account_owner, classification }) {
  const viewRecord = {
    one_list_account_owner: get(one_list_account_owner, 'name', 'None'),
    one_list_tier: get(classification, 'name', 'None'),
  }

  return getDataLabels(viewRecord, accountManagementDisplayLabels)
}
