import pipelineApi from '../../../apps/my-pipeline/client/api'

export function getPipelineList({ status }) {
  return pipelineApi.list({ status }).then(({ data }) => data.results)
}
