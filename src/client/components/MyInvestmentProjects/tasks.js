import { apiProxyAxios } from '../Task/utils'

export const fetchMyInvestmentsList = ({ limit = 10, page, adviser }) => {
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      offset: limit * (page - 1),
      adviser: [adviser.id],
    })
    .then(({ data }) => data)
}
