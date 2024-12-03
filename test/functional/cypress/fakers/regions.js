import { faker } from '../../../sandbox/utils.mjs'

import { listFaker } from './utils'

export const ukRegionFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(),
  disabled_on: null,
  ...overrides,
})

export const ukRegionListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: ukRegionFaker, length, overrides })

export default ukRegionListFaker
