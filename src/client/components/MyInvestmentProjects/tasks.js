import { apiProxyAxios } from '../Task/utils'

export const fetchMyInvestmentsList = ({ limit = 10, page, adviser }) => {
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      offset: limit * (parseInt(page, 10) - 1) || 0,
      adviser: [adviser.id],
    })
    .then(({ data }) => data.results)
}
