import { createEntityResource } from './Resource'

export default createEntityResource(
  'StovaEvent',
  (id) => `v4/company-activity/stova-events/${id}`
)
