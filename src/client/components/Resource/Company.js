import { createEntityResource } from './Resource'

export default createEntityResource('Company', (id) => `v4/company/${id}`)
