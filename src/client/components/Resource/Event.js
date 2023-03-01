import { createEntityResource } from '.'

export default createEntityResource('Event', (id) => `v3/event/${id}`)
