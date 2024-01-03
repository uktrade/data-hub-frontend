import { createEntityResource } from './Resource'

export default createEntityResource(
  'OrderInvoice',
  (id) => `v3/omis/order/${id}/invoice`
)
