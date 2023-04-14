import { createEntityResource } from './Resource'

export default createEntityResource(
  'PipelineItem',
  (id) => `v4/pipeline-item/${id}`
)
