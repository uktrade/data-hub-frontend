import { faker } from '../../../utils'

import { listFaker } from './utils'

const sectors = ['Aerospace', 'Mining', 'Railways']

export const sectorFaker = (overrides = {}) => ({
  ancestors: [],
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(sectors),
  ...overrides,
})

export const sectorListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: sectorFaker, length, overrides })

export default sectorListFaker
