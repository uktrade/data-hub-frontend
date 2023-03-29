import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export const getProjectsWon = ({ companyId }) => {
  let somedata = apiProxyAxios
    .get('/v3/investments', {
      params: {
        id: '6e3db5e4-4ef0-436c-9770-245ec895725c',
      },
    })
    .then(({ data }) => ({ test: data }))

  return apiProxyAxios
    .post('/v3/search/investment_project', {
      ...(companyId && {
        investor_company: [companyId],
      }),
    })
    .then(({ data }) => ({
      results: data.results,
      testData: somedata,
    }))
}
