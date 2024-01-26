import { apiProxyAxios } from '../../../components/Task/utils'

export const saveWinCategory = ({ companyId, export_experience_category }) => {
  return apiProxyAxios
    .patch(`/v4/company/${companyId}`, {
      export_experience_category: export_experience_category || null,
    })
    .then((response) => response.data)
}
