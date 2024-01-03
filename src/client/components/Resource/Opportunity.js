import { createEntityResource } from './Resource'

export default createEntityResource(
  'Opportunity',
  (id) => `v4/large-capital-opportunity/${id}`
)
