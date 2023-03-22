import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export const getProjectsWon = ({ limit = 200, companyId }) => {
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      ...(companyId && {
        investor_company: [companyId],
      }),
    })
    .then(({ data }) => ({
      results: data.results,
    }))
}
