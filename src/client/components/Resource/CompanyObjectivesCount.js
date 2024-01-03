import { createEntityResource } from './Resource'

export default createEntityResource(
  'CompanyObjectivesCount',
  (id) => `v4/company/${id}/objective/count`
)
