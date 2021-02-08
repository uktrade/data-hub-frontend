import { apiProxyAxios } from '../Task/utils'

export const fetchInvestmentSummary = ({ adviser }) => {
  return apiProxyAxios
    .get(`/v4/adviser/${adviser.id}/investment-summary`)
    .then(({ data }) => data)
}
