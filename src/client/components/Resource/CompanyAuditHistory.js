import { createCollectionResource } from './Resource'

export default createCollectionResource(
  'changes to company business details',
  (id) => `v4/company/${id}/audit`
)
