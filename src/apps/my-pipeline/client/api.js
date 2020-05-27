import axios from 'axios'

const endpoint = '/api-proxy/v4/pipeline-item'

function handleSuccess(result) {
  return result
}

function handleError(error) {
  const message = error?.response?.data?.detail || error.message
  return Promise.reject({
    message,
    ...error,
  })
}

function getPipelineItems(filter) {
  return axios
    .get(`${endpoint}`, { params: filter })
    .then(handleSuccess, handleError)
}

function getPipelineItem(pipelineItemId) {
  return axios
    .get(`${endpoint}/${pipelineItemId}`)
    .then(handleSuccess, handleError)
}

function createPipelineItem(values) {
  return axios.post(`${endpoint}`, values).then(handleSuccess, handleError)
}

function updatePipelineItem(pipelineItemId, values) {
  return axios
    .patch(`${endpoint}/${pipelineItemId}`, values)
    .then(handleSuccess, handleError)
}

const pipelineApi = {
  list: getPipelineItems,
  get: getPipelineItem,
  update: updatePipelineItem,
  create: createPipelineItem,
}

export default pipelineApi
