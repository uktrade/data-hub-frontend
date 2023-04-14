import { createEntityResource } from './Resource'

export default createEntityResource(
  'Interaction',
  (id) => `v4/interaction/${id}`
)
