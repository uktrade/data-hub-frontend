import { faker } from '@faker-js/faker'

import { listFaker } from './utils'
import { sectorFaker } from './sectors'

const exportFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  company: {
    id: faker.datatype.uuid(),
    name: faker.company.name(),
  },
  owner: {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
  },
  team_members: [
    {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
    },
  ],
  contacts: {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
  },
  destination_country: {
    id: faker.datatype.uuid(),
    name: faker.address.country(),
  },
  sector: {
    id: faker.datatype.uuid(),
    name: sectorFaker(),
  },
  exporter_experience: faker.datatype.uuid(),
  estimated_export_value_years: faker.random.numeric(5),
  created_on: faker.date.past(),
  modified_on: faker.date.past(),
  title: faker.random.word(),
  estimated_export_value_amount: faker.random.numeric(6),
  estimated_win_date: faker.date.future(),
  export_potential: faker.helpers.arrayElement(['high', 'medium', 'low']),
  status: faker.helpers.arrayElement(['active', 'won', 'inactive']),
  notes: faker.random.words(25),
  created_by: faker.datatype.uuid(),
  modified_by: faker.datatype.uuid(),
  ...overrides,
})

const exportListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: exportFaker, length, overrides })

export { exportFaker, exportListFaker }

export default exportListFaker
