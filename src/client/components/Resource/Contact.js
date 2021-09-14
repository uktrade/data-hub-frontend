import { createEntityResource } from '.'

export default createEntityResource('Contact', (id) => `v3/contact/${id}`)
