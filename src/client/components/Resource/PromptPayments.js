import { createEntityResource } from './Resource'

export default createEntityResource(
  'PromptPayments',
  (companyId) => `v4/company/${companyId}/prompt-payments`
)
