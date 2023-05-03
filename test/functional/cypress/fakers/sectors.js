import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const sectors = [
  'Advanced Engineering',
  'Biotechnology and Pharmaceuticals',
  'Creative and Media',
]

export const sectorFaker = () => ({
  ancestors: [],
  id: faker.datatype.uuid(),
  name: faker.helpers.arrayElement(sectors),
})

export const sectorListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: sectorFaker, length, overrides })

export default sectorListFaker
