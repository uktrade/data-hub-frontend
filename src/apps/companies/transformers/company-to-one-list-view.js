/* eslint-disable camelcase */
const { get } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { accountManagementDisplayLabels } = require('../labels')

module.exports = function transformCompanyToOneListView ({ one_list_account_owner, classification }) {
  const viewRecord = {
    oneListAccountManager: get(one_list_account_owner, 'name', 'None'),
    oneListTier: get(classification, 'name', 'None'),
  }

  return getDataLabels(viewRecord, accountManagementDisplayLabels)
}
