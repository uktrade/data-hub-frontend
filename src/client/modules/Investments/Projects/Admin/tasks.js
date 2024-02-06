import { apiProxyAxios } from '../../../../components/Task/utils'

export const updateProjectStage = ({ values, projectId }) =>
  apiProxyAxios.post(`/v3/investment/${projectId}/update-stage`, {
    stage: { id: values.projectStageId },
  })
