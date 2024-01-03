import { createEntityResource } from './Resource'

export default createEntityResource(
  'OrderPayment',
  (id) => `v3/omis/order/${id}/payment`
)
