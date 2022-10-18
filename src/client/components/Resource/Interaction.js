import { createEntityResource } from '.'

export default createEntityResource(
  'Interaction',
  (id) => `v4/interaction/${id}`
)
