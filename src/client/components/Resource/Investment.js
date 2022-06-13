import { createEntityResource } from '.'

export default createEntityResource('Investment', (id) => `v3/investment/${id}`)
