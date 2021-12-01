import { createEntityResource } from '.'

export default createEntityResource(
  'PipelineItem',
  (id) => `v4/pipeline-item/${id}`
)
