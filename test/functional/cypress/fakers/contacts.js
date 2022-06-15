import { faker } from '@faker-js/faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'

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

const DIT_TEAM_NAMES = [
  'Digital Data Hub - Live Service',
  'Aberdeen City Council',
  'Healthcare UK',
]

const contactFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Contact),
  id: faker.datatype.uuid(),
  job_title: faker.name.jobTitle(),
  ...userFaker(),
  adviser: {
    id: faker.datatype.uuid(),
    ...userFaker(),
  },
  company: {
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    trading_names: [faker.company.companyName(), faker.company.companyName()],
  },
  company_uk_region: {
    name: faker.helpers.arrayElement(UK.REGIONS),
    id: faker.datatype.uuid(),
  },
  company_sector: {
    name: faker.helpers.arrayElement(SECTOR_NAMES),
    id: faker.datatype.uuid(),
    ancestors: [],
  },
  primary: faker.datatype.boolean(),
  telephone_countrycode: UK.COUNTRY_CODE,
  full_telephone_number: `+44 ${faker.helpers.arrayElement(
    UK.TELEPHONE_NUMBERS
  )}`,
  telephone_number: faker.helpers.arrayElement(UK.TELEPHONE_NUMBERS),
  telephone_alternative: faker.helpers.arrayElement(UK.TELEPHONE_NUMBERS),
  email: faker.unique(faker.internet.email).toLocaleLowerCase(),
  email_alternative: faker.unique(faker.internet.email),
  address_same_as_company: true,
  address_1: faker.address.streetAddress(),
  address_2: faker.address.streetName(),
  address_town: faker.address.city(),
  address_county: faker.address.county(),
  address_postcode: faker.helpers.arrayElement(UK.POST_CODES),
  address_country: {
    id: faker.datatype.uuid(),
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
    dit_team: {
      name: faker.helpers.arrayElement(DIT_TEAM_NAMES),
      id: faker.datatype.uuid(),
    },
  },
  modified_on: faker.date.past(),
  ...overrides,
})

const contactsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: contactFaker, length, overrides })

export { contactFaker, contactsListFaker }

export default contactsListFaker
