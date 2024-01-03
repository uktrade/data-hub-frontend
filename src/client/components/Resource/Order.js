import { createEntityResource } from './Resource'

export default createEntityResource('Order', (id) => `v3/omis/order/${id}`)
