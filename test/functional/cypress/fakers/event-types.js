import { faker } from '../../../sandbox/utils'
import { listFaker } from './utils'

/**
 * Generate fake data for an event type.
 */
const eventTypeFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(),
  disabled_on: null,
  ...overrides,
})

/**
 * Generate fake data for a list of event types.
 */
const eventTypeListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: eventTypeFaker, length, overrides })

export { eventTypeFaker, eventTypeListFaker }

export default eventTypeListFaker
