import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import { validateTeamAdvisersAreUnique } from './validator'

export const updateTeamMembers = ({ teamMembers, id }) => {
  return new Promise(async (resolve, reject) => {
    const reasonAdvisersAreNotUnique =
      validateTeamAdvisersAreUnique(teamMembers)
    if (reasonAdvisersAreNotUnique) {
      reject(reasonAdvisersAreNotUnique)
    } else {
      const url = `v3/investment/${id}/team-member`
      const response = await apiProxyAxios.put(url, teamMembers)
      resolve(response)
    }
  })
}

export const saveClientRelationshipManager = ({
  id,
  clientRelationshipManagerId,
}) =>
  apiProxyAxios
    .patch(`/v3/investment/${id}`, {
      client_relationship_manager: clientRelationshipManagerId,
    })
    .then((results) => results.client_relationship_manager)
