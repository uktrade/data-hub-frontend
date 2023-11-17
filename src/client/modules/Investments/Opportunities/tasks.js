import { apiProxyAxios } from '../../../components/Task/utils'

export function createOpportunity(name) {
  return apiProxyAxios
    .post('v4/large-capital-opportunity', name)
    .then(({ data: { id } }) => id)
}
