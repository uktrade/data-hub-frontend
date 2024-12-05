import { faker, jsf } from '../../../sandbox/utils/random'

import apiSchema from '../../../api-schema.json'

import { listFaker, randomChoice } from './utils'
import { sectorFaker } from './sectors'
import { CANADA_ID, UK_REGIONS } from '../../../../src/common/constants'

const WALES = {
  name: 'Wales',
  id: UK_REGIONS.WALES,
}

const CANADA = {
  name: 'Canada',
  id: CANADA_ID,
}

const ALBERTA = {
  name: 'Alberta',
  id: '75e337c3-23c9-4294-8085-6b1e8c43eb07',
}

const INTENT_CHOICES = [
  'Set up new premises',
  'Set up a new distribution centre',
  'Onward sales and exports from the UK',
  'Research, develop and collaborate',
  'Find people with specialist skills',
  'Other',
]

const HIRING_CHOICES = [
  '1 to 5',
  '6 to 50',
  '51 to 100',
  'More than 100',
  'No plans to hire',
]

const SPEND_CHOICES = [
  'Less than £10,000',
  '£10,000 to £500,000',
  '£500,000 to £1 million',
  '£1 million to £2 million',
  '£2 million to £5 million',
  '£5 million to £10 million',
  'More than £10 million',
]

const LANDING_TIMEFRAME_CHOICES = [
  'In the next 6 months',
  '6 to 12 months',
  '1 to 2 years',
  "In more than 2 years' time",
]

/**
 * Generate fake data for a single EYB lead.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const eybLeadFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.RetrieveEYBLead),
  archived: false,
  archived_on: null,
  archived_reason: null,
  archived_by: null,
  created_on: faker.date.recent(),
  modified_on: faker.date.recent(),
  id: faker.string.uuid(),
  triage_hashed_uuid: faker.string.uuid(),
  triage_created: faker.date.recent(),
  triage_modified: faker.date.recent(),
  sector: sectorFaker(),
  sector_sub: '',
  intent: faker.helpers.arrayElements(
    INTENT_CHOICES,
    faker.number.int({ min: 1, max: 6 })
  ),
  intent_other: '',
  proposed_investment_city: 'Cardiff',
  proposed_investment_location_none: false,
  proposed_investment_region: WALES,
  hiring: randomChoice(HIRING_CHOICES),
  spend: randomChoice(SPEND_CHOICES),
  spend_other: '',
  is_high_value: faker.datatype.boolean(),
  user_hashed_uuid: faker.string.uuid(),
  user_created: faker.date.recent(),
  user_modified: faker.date.recent(),
  company_name: faker.company.name(),
  address_country: CANADA,
  full_name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  email: faker.internet.email(),
  telephone_number: faker.phone.number(),
  agree_terms: true,
  agree_info_email: true,
  landing_timeframe: randomChoice(LANDING_TIMEFRAME_CHOICES),
  company_website: faker.internet.url(),
  duns_number: faker.number.int({ min: 1000000, max: 9999999 }).toString(),
  company: {
    name: faker.company.name(),
    id: faker.string.uuid(),
  },
  address: {
    line_1: faker.location.streetAddress(),
    line_2: faker.location.secondaryAddress(),
    town: faker.location.city(),
    county: faker.location.county(),
    postcode: faker.location.zipCode(),
    area: ALBERTA,
    country: CANADA,
  },
  investment_projects: [
    {
      id: faker.string.uuid(),
    },
  ],
  ...overrides,
})

/**
 * Generate fake data for a list of EYB leads.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const eybLeadListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: eybLeadFaker, length, overrides })

export { eybLeadFaker, eybLeadListFaker }
