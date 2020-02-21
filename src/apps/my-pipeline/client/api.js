import { apiProxyAxios } from '../../../client/components/Task/utils'

const endpoint = 'v4/pipeline-item'

const getPipelineItems = (filter) =>
  apiProxyAxios.get(`${endpoint}`, { params: filter })

const getPipelineItem = (pipelineItemId) =>
  apiProxyAxios.get(`${endpoint}/${pipelineItemId}`)

const createPipelineItem = (values) => apiProxyAxios.post(`${endpoint}`, values)

const updatePipelineItem = (pipelineItemId, values) =>
  apiProxyAxios.patch(`${endpoint}/${pipelineItemId}`, values)

const archivePipelineItem = (pipelineItemId, values) =>
  apiProxyAxios.post(`${endpoint}/${pipelineItemId}/archive`, values)

const unarchivePipelineItem = (pipelineItemId) =>
  apiProxyAxios.post(`${endpoint}/${pipelineItemId}/unarchive`)

const deletePipelineItem = (pipelineItemId) =>
  apiProxyAxios.delete(`${endpoint}/${pipelineItemId}`)

const pipelineApi = {
  list: getPipelineItems,
  get: getPipelineItem,
  update: updatePipelineItem,
  create: createPipelineItem,
  archive: archivePipelineItem,
  unarchive: unarchivePipelineItem,
  delete: deletePipelineItem,
}

export default pipelineApi
