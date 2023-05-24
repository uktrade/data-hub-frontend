import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const sectors = [
  'Advanced Engineering',
  'Biotechnology and Pharmaceuticals',
  'Creative and Media',
]

export const sectorFaker = (overrides = {}) => ({
  ancestors: [],
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(sectors),
  ...overrides,
})

export const sectorListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: sectorFaker, length, overrides })

export default sectorListFaker
