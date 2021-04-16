import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getOpportunityDetail(id) {
  return apiProxyAxios
    .get(`/v4/large-capital-opportunity/${id}`)
    .then(({ data }) => {
      return data
    })
}

export function getOpportunities() {
  return apiProxyAxios.get('/v4/large-capital-opportunity').then(({ data }) => {
    return data
  })
}
