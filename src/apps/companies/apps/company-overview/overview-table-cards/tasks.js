import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export const getProjectsWon = async ({ companyId }) => {
  let investmentProjects = await apiProxyAxios
    .post('/v3/search/investment_project', {
      ...(companyId && {
        investor_company: [companyId],
      }),
    })
    .then(({ data }) => ({
      results: data.results,
    }))

  let wonList = investmentProjects.results.filter(
    (wonInvestment) => wonInvestment.status === 'won'
  )
  let wonData = await fetchWonInvestment(wonList)

  let results = {
    investmentProjects,
    wonData,
  }
  return results
}

async function fetchWonInvestment(wonList) {
  let investmentList = {}
  for (let i = 0; i < wonList.length; i++) {
    investmentList[i] = await apiProxyAxios
      .get(`/v3/investment/${wonList[i].id}`)
      .then(({ data }) => ({ data }))
  }
  return investmentList
}
