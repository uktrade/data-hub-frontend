const { get } = require('lodash')

// eslint-disable-next-line camelcase
const transformAccountManager = ({ one_list_group_global_account_manager }) => ({
  name: get(one_list_group_global_account_manager, 'name'),
  email: get(one_list_group_global_account_manager, 'contact_email'),
  team: get(one_list_group_global_account_manager, '["dit_team"].name'),
})

module.exports = transformAccountManager
