import { createEntityResource } from './Resource'

export default createEntityResource(
  'ContactAuditHistory',
  (id) => `v3/contact/${id}/audit`
)
