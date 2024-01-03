import { createEntityResource } from './Resource'

export default createEntityResource('Task', (id) => `v4/task/${id}`)
