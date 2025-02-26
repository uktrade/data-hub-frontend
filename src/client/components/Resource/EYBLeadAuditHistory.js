import { createCollectionResource } from './Resource'

export default createCollectionResource(
  'Changes to EYB lead details',
  (id) => `v4/investment-lead/eyb/${id}/audit`
)
