import { createCollectionResource } from './Resource'

export default createCollectionResource(
  'project change',
  (id) => `v3/investment/${id}/audit`
)
