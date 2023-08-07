import { createEntityResource } from './Resource'

export default createEntityResource(
  'CompanyObjectives',
  (id) => `v4/company/${id}/objective?sortby=target_date`
)
