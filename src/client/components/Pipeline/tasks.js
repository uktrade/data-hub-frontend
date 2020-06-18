import pipelineApi from '../../../apps/my-pipeline/client/api'

export function getPipelineList(filters) {
  return pipelineApi.list(filters).then(({ data }) => data.results)
}
