import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export function getOpportunities() {
  return apiProxyAxios
    .get('/v4/large-capital-opportunity')
    .then(({ data }) => data)
}
