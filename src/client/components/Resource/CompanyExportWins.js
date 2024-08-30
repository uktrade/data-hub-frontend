import { createCollectionResource } from './Resource'

export default createCollectionResource(
  'Company Export Wins',
  (id) => `v4/company/${id}/export-win`
)
