import { createEntityResource } from './Resource'

export default createEntityResource(
  'CompanyContacts',
  (id) => `v4/contact?company_id=${id}`
)
