import { createEntityResource } from '.'

export default createEntityResource(
  'LargeInvestorProfile',
  (id) => `v4/large-investor-profile?investor_company_id=${id}`
)
