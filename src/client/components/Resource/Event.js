import { createEntityResource } from './Resource'

export default createEntityResource('Event', (id) => `v3/event/${id}`)
