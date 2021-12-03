import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export async function updateAdviser({ dit_participants, companyId }) {
  await apiProxyAxios.post(
    `/api-proxy/v4/company/${companyId}/assign-regional-account-manager`,
    { regional_account_manager: dit_participants.value }
  )
  const { data } = await apiProxyAxios.get(`/api-proxy/v4/company/${companyId}`)
  const leadIta = data.one_list_group_global_account_manager
  return {
    ...leadIta,
    email: leadIta.contact_email,
  }
}
