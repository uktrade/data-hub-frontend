import { faker } from '../../../sandbox/utils'

import { listFaker } from './utils'

const serviceFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.jobArea(),
  disabled_on: null,
  contexts: [
    'investment_project_interaction',
    'event',
    'service_delivery',
    'interaction',
  ],
  interaction_questions: [],
  ...overrides,
})

const servicesListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: serviceFaker, length, overrides })

export { serviceFaker, servicesListFaker }

export default servicesListFaker
