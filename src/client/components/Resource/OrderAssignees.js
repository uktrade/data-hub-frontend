import { createEntityResource } from './Resource'

export default createEntityResource(
  'OrderAssignees',
  (id) => `v3/omis/order/${id}/assignee`
)
