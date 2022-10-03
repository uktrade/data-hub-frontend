import { createEntityResource } from '.'

export default createEntityResource(
  'ContactAuditHistory',
  (id) => `v3/contact/${id}/audit`
)
