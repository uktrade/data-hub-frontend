import { createEntityResource } from './Resource'

export default createEntityResource('Contact', (id) => `v3/contact/${id}`)
