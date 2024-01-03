import { createEntityResource } from './Resource'

export default createEntityResource('Export', (id) => `v4/export/${id}`)
