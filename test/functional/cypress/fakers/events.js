import { faker, jsf } from '../../../utils'

import apiSchema from '../../../api-schema.json'

import { listFaker } from './utils'

/**
 * Generate fake data for a single event.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const eventFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Event),
  id: faker.string.uuid(),
  name: faker.lorem.words(),
  ...overrides,
})

/**
 * Generate fake data for a list of events.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const eventListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: eventFaker, length, overrides })

export { eventFaker, eventListFaker }

export default eventListFaker
