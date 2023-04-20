import { faker } from '@faker-js/faker'

import { listFaker } from './utils'
import { sectorFaker } from './sectors'
import { contactFaker } from './contacts'

import { ESTIMATED_EXPORT_VALUE_YEARS } from './constants'

const exportFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  company: {
    id: faker.datatype.uuid(),
    name: faker.company.name(),
  },
  owner: contactFaker(),
  team_members: [contactFaker()],
  contacts: [contactFaker()],
  destination_country: {
    id: faker.datatype.uuid(),
    name: faker.address.country(),
  },
  sector: sectorFaker(),
  exporter_experience: faker.datatype.uuid(),
  estimated_export_value_years: faker.helpers.arrayElement(
    ESTIMATED_EXPORT_VALUE_YEARS
  ),
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
  archived: false,
  ...overrides,
})

const exportListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: exportFaker, length, overrides })

export { exportFaker, exportListFaker }

export default exportListFaker
