import { createEntityResource } from './Resource'

export default createEntityResource(
  'Export Win Review',
  (id) => `v4/export-win/review/${id}`
)
