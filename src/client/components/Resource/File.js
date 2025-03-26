import { createEntityResource } from './Resource'

export default createEntityResource('File', (id) => `v4/document/${id}`)
