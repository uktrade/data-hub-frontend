import { createEntityResource } from '.'

export default createEntityResource(
  'Opportunity',
  (id) => `v4/large-capital-opportunity/${id}`
)
