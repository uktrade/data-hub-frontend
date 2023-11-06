import { createEntityResource } from './Resource'

export default createEntityResource(
  'OrderQuote',
  (id) => `v3/omis/order/${id}/quote`
)
