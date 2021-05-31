import faker from 'faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'

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

const getFakePerson = () => {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()
  return {
    id: faker.datatype.uuid(),
    first_name,
    last_name,
    name: `${first_name} ${last_name}`,
  }
}

const contactFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Contact),
  id: faker.datatype.uuid(),
  job_title: faker.name.jobTitle(),
  ...getFakePerson(),
  adviser: {
    id: faker.datatype.uuid(),
    ...getFakePerson(),
  },
  company: {
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    trading_names: [faker.company.companyName(), faker.company.companyName()],
  },
  company_uk_region: {
    name: faker.random.arrayElement(UK.REGIONS),
    id: faker.datatype.uuid(),
  },
  company_sector: {
    name: faker.random.arrayElement(SECTOR_NAMES),
    id: faker.datatype.uuid(),
    ancestors: [],
  },
  primary: faker.datatype.boolean(),
  telephone_countrycode: UK.COUNTRY_CODE,
  telephone_number: faker.random.arrayElement(UK.TELEPHONE_NUMBERS),
  telephone_alternative: faker.random.arrayElement(UK.TELEPHONE_NUMBERS),
  email: faker.unique(faker.internet.email).toLocaleLowerCase(),
  email_alternative: faker.unique(faker.internet.email),
  address_same_as_company: true,
  address_1: faker.address.streetAddress(),
  address_2: faker.address.streetName(),
  address_town: faker.address.city(),
  address_county: faker.address.county(),
  address_postcode: faker.random.arrayElement(UK.POST_CODES),
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
    ...getFakePerson(),
    dit_team: {
      name: faker.random.arrayElement(DIT_TEAM_NAMES),
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
