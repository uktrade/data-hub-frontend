const axios = require('axios')

export function updateAdviser({ values }) {
  const { dit_participants, companyId } = values
  return axios
    .post(
      `/api-proxy/v4/company/${companyId}/assign-regional-account-manager`,
      {
        regional_account_manager: dit_participants.value,
      }
    )
    .then(() => {
      return axios
        .get(`/api-proxy/v4/company/${companyId}`)
        .then(
          ({ data: { one_list_group_global_account_manager: adviser } }) => {
            return {
              name: adviser?.name,
              email: adviser?.contact_email,
            }
          }
        )
    })
}
