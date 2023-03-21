import { apiProxyAxios } from '../../../../../client/components/Task/utils'

//export const getProjectsWon = ({ limit = 100, page, companyId, ...rest }) => {
export const getProjectsWon = ({ limit = 100, companyId }) => {
  // const transformedRest = transformLandDateFilters(rest)
  return apiProxyAxios
    .post('/v3/search/investment_project', {
      limit,
      ...(companyId && {
        investor_company: [companyId],
      }),
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results,
    }))
}
