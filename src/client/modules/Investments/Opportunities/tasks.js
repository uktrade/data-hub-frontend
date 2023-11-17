import { apiProxyAxios } from '../../../components/Task/utils'

export function createOpportunity(name) {
  return apiProxyAxios
    .post('v4/large-capital-opportunity', name)
    .then(({ data: { id } }) => id)
}

export function saveOpportunityStatus({ opportunityId, values }) {
  return apiProxyAxios.patch(`v4/large-capital-opportunity/${opportunityId}`, {
    status: values.status,
  })
}
