import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export function updateProjectStage({ values, projectId }) {
  return apiProxyAxios.post(`/v3/investment/${projectId}/update-stage`, {
    stage: {
      id: values.projectStageId,
    },
  })
}
