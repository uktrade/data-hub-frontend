import axios from 'axios'

const endpoint = '/api-proxy/v4/pipeline-item'

function getPipelineItems(filter) {
  return axios.get(`${endpoint}`, { params: filter })
}

function getPipelineItem(pipelineItemId) {
  return axios.get(`${endpoint}/${pipelineItemId}`)
}

function createPipelineItem(values) {
  return axios.post(`${endpoint}`, values)
}

function updatePipelineItem(pipelineItemId, values) {
  return axios.patch(`${endpoint}/${pipelineItemId}`, values)
}

const pipelineApi = {
  list: getPipelineItems,
  get: getPipelineItem,
  update: updatePipelineItem,
  create: createPipelineItem,
}

export default pipelineApi
