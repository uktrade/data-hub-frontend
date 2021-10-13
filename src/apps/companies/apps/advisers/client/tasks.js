import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export const updateAdviser = ({ dit_participants, companyId }) =>
  Promise.all([
    apiProxyAxios.post(
      `/api-proxy/v4/company/${companyId}/assign-regional-account-manager`,
      { regional_account_manager: dit_participants.value }
    ),
    apiProxyAxios.get(`/api-proxy/v4/company/${companyId}`),
  ]).then(([, { data }]) => ({
    ...data.one_list_group_global_account_manager,
    email: data.one_list_group_global_account_manager?.email,
  }))
