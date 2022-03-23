import { faker } from '@faker-js/faker'

const sectors = [
  'Advanced Engineering',
  'Biotechnology and Pharmaceuticals',
  'Creative and Media',
]

export const sectorFaker = () => ({
  ancestors: [],
  id: faker.datatype.uuid(),
  name: faker.random.arrayElement(sectors),
})
