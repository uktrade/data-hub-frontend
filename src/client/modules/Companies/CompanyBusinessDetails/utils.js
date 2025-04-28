export const isOneListAccountOwner = (company, currentAdviserId) =>
  company?.one_list_group_global_account_manager?.id == currentAdviserId

export const canEditOneList = (permissions) =>
  permissions &&
  permissions.includes('company.change_company') &&
  (permissions.includes('company.change_one_list_core_team_member') ||
    permissions.includes(
      'company.change_one_list_tier_and_global_account_manager'
    ))

export const canEditOneListTierAndGlobalAccountManager = (permissions) =>
  permissions &&
  permissions.includes('company.change_company') &&
  permissions.includes(
    'company.change_one_list_tier_and_global_account_manager'
  )
