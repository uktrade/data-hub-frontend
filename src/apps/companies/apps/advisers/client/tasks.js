import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export async function updateAdviser({ dit_participants, companyId }) {
  await apiProxyAxios.post(
    `/v4/company/${companyId}/assign-regional-account-manager`,
    { regional_account_manager: dit_participants.value }
  )
  const { data } = await apiProxyAxios.get(`/v4/company/${companyId}`)
  const leadIta = data.one_list_group_global_account_manager
  if (leadIta) {
    return {
      ...leadIta,
      email: leadIta.contact_email,
    }
  } else {
    return Promise.reject(
      new Error(
        "No global Lead ITAs were found for this company. Please note: it is not possible to add Lead ITAs to a subsidiary that are not attached to the company's Global Headquarters"
      )
    )
  }
}
