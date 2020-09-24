import { apiProxyAxios } from '../../../../../client/components/Task/utils'

export function updateProjectStage({ values, projectId }) {
  return apiProxyAxios.post(
    `/api-proxy/v3/investment/${projectId}/update-stage`,
    {
      stage: {
        id: values.projectStageId,
      },
    }
  )
}
