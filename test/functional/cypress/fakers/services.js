import { faker } from '@faker-js/faker'
import { listFaker } from './utils'

const serviceFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.jobArea(),
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
