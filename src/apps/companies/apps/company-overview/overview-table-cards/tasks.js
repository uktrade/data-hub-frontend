import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export const getProjectsWon = async ({ companyId }) => {
  return await apiProxyAxios
    .post('/v3/search/investment_project', {
      ...(companyId && {
        investor_company: [companyId],
        show_summary: true,
      }),
    })
    .then(({ data }) => ({
      results: data.results,
      summary: data.summary,
    }))
}
