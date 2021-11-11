import { createEntityResource } from '.'

export default createEntityResource('Event', (id) => `v4/event/${id}`)
