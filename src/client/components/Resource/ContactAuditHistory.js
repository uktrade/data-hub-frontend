import { createCollectionResource } from './Resource'

export default createCollectionResource(
  'contact change',
  (id) => `v3/contact/${id}/audit`
)
