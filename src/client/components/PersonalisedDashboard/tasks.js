import { apiProxyAxios } from '../Task/utils'

export const checkForInvestments = ({ adviser }) => {
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit: 1,
      adviser: adviser.id,
    })
    .then(({ data }) => data)
}
