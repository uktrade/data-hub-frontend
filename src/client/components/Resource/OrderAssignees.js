import { createEntityResource } from '.'

export default createEntityResource(
  'OrderAssignees',
  (id) => `v3/omis/order/${id}/assignee`
)
