import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'

const policyAreaFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.jobArea(),
  disabled_on: null,
  ...overrides,
})

const policyAreaListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: policyAreaFaker, length, overrides })

export { policyAreaFaker, policyAreaListFaker }

export default policyAreaListFaker
