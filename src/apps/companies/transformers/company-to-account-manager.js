// eslint-disable-next-line camelcase
const transformAccountManager = ({ one_list_group_global_account_manager }) => ({
  name: one_list_group_global_account_manager.name,
  email: one_list_group_global_account_manager.contact_email,
  team: one_list_group_global_account_manager.dit_team.name,
})

module.exports = transformAccountManager
