import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'
import { sectorFaker } from './sectors'
import { contactFaker } from './contacts'
import { countryFaker } from './countries'

import { ESTIMATED_EXPORT_VALUE_YEARS, EXPORTER_EXPERIENCE } from './constants'

const exportFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  owner: contactFaker(),
  team_members: [contactFaker()],
  contacts: [contactFaker()],
  destination_country: countryFaker(),
  sector: sectorFaker(),
  exporter_experience: faker.helpers.arrayElement(
    EXPORTER_EXPERIENCE.filter((element) => !element.disabled_on)
  ),
  estimated_export_value_years: faker.helpers.arrayElement(
    ESTIMATED_EXPORT_VALUE_YEARS
  ),
  created_on: faker.date.past(),
  modified_on: faker.date.past(),
  title: faker.word.sample(),
  estimated_export_value_amount: faker.string.numeric(6),
  estimated_win_date: faker.date.future(),
  export_potential: faker.helpers.arrayElement(['high', 'medium', 'low']),
  status: faker.helpers.arrayElement(['active', 'won', 'inactive']),
  notes: faker.word.words(25),
  created_by: faker.string.uuid(),
  modified_by: faker.string.uuid(),
  archived: false,
  ...overrides,
})

const exportListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: exportFaker, length, overrides })

export { exportFaker, exportListFaker }

export default exportListFaker
