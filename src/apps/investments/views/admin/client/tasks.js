const axios = require('axios')

export function updateProjectStage({ values, projectId }) {
  return axios.post(`/api-proxy/v3/investment/${projectId}/update-stage`, {
    stage: {
      id: values.projectStageId,
    },
  })
}
