import { apiProxyAxios } from '../Task/utils'

export const fetchMyInvestmentsList = ({
  limit = 10,
  page = 1,
  adviser,
  sort,
  filter,
}) => {
  const payload = {
    limit,
    offset: limit * (page - 1),
    adviser: adviser.id,
    sortby: sort,
  }

  if (filter !== 'all-stages') {
    payload.stage = filter
  }

  return apiProxyAxios
    .post('/v3/search/investment_project', payload)
    .then(({ data }) => data)
}
