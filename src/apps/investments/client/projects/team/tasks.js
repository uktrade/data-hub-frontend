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

export const saveProjectManagementStaff = ({
  id,
  projectAssuranceAdviserId,
  projectManagerId,
}) =>
  apiProxyAxios
    .patch(`/v3/investment/${id}`, {
      project_assurance_adviser: projectAssuranceAdviserId,
      project_manager: projectManagerId,
    })
    .then((results) => {
      results.project_assurance_adviser, results.project_manager
    })
