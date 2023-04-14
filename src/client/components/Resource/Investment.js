import { createEntityResource } from './Resource'

export default createEntityResource('Investment', (id) => `v3/investment/${id}`)
