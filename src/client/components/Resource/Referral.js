import { createEntityResource } from './Resource'

export default createEntityResource(
  'Referral',
  (id) => `v4/company-referral/${id}`
)
