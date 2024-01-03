import { createEntityResource } from './Resource'

export default createEntityResource(
  'OrderSubscribers',
  (id) => `v3/omis/order/${id}/subscriber-list`
)
