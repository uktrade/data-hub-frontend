import { createEntityResource } from './Resource'

export default createEntityResource(
  'InvestmentEvidence',
  (id) => `v3/investment/${id}/evidence-document`
)
