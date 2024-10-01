import { createEntityResource } from './Resource'

export default createEntityResource(
  'EYBLead',
  (id) => `v4/investment-lead/eyb/${id}`
)
