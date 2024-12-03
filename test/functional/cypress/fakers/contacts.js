import { faker, jsf } from '../../../sandbox/utils'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import { ditTeamFaker } from './dit-team'

const UK = {
  NAME: 'United Kingdom',
  COUNTRY_CODE: '0044',
  REGIONS: ['London', 'South East'],
  POST_CODES: ['SW1H9AJ', 'SW1A2HN', 'SW20 0XU'],
  TELEPHONE_NUMBERS: ['02072155000', '02033343555', '02074834456'],
}

const SECTOR_NAMES = [
  'Advanced Engineering',
  'Biotechnology and Pharmaceuticals',
  'Creative and Media',
]

const contactFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Contact),
  id: faker.string.uuid(),
  job_title: faker.person.jobTitle(),
  ...userFaker(),
  adviser: {
    id: faker.string.uuid(),
    ...userFaker(),
  },
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
    trading_names: [faker.company.name(), faker.company.name()],
  },
  company_uk_region: {
    name: faker.helpers.arrayElement(UK.REGIONS),
    id: faker.string.uuid(),
  },
  company_sector: {
    name: faker.helpers.arrayElement(SECTOR_NAMES),
    id: faker.string.uuid(),
    ancestors: [],
  },
  primary: faker.datatype.boolean(),
  telephone_countrycode: UK.COUNTRY_CODE,
  full_telephone_number: `+44 ${faker.helpers.arrayElement(
    UK.TELEPHONE_NUMBERS
  )}`,
  telephone_number: faker.helpers.arrayElement(UK.TELEPHONE_NUMBERS),
  telephone_alternative: faker.helpers.arrayElement(UK.TELEPHONE_NUMBERS),
  email: faker.internet.email(),
  email_alternative: faker.internet.email(),
  address_same_as_company: true,
  address_1: faker.location.streetAddress(),
  address_2: faker.location.street(),
  address_town: faker.location.city(),
  address_county: faker.location.county(),
  address_postcode: faker.helpers.arrayElement(UK.POST_CODES),
  address_country: {
    id: faker.string.uuid(),
    name: UK.NAME,
  },
  notes: faker.lorem.paragraph(),
  archived: false,
  archived_on: null,
  archived_reason: null,
  archived_by: null,
  created_on: faker.date.past(),
  created_by: {
    ...userFaker(),
    dit_team: ditTeamFaker(),
  },
  modified_on: faker.date.past(),
  ...overrides,
})

const contactsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: contactFaker, length, overrides })

export { contactFaker, contactsListFaker }

export default contactsListFaker
