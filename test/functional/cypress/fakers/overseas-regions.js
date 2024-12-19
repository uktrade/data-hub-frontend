import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'

export const overseasRegionFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(),
  disabled_on: null,
  ...overrides,
})

export const overseasRegionListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: overseasRegionFaker, length, overrides })

export default overseasRegionListFaker
