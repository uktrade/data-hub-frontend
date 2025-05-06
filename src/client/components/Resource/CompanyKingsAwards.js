import { createEntityResource } from './Resource'

export default createEntityResource(
  'CompanyKingsAwards',
  (companyId) => `v4/company/${companyId}/kings-awards`
)
