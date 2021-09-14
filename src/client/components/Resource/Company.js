import { createEntityResource } from '.'

export default createEntityResource('Company', (id) => `v4/company/${id}`)
