import { faker } from '@faker-js/faker'

import { relativeDateFaker } from './dates'
import { investmentProjectCodeFaker } from './investment-projects'
import { listFaker } from './utils'

export const nestedAdviserFaker = (overrides = {}) => ({
  name: faker.name.fullName(),
  dit_team: {
    name: `${faker.address.country()} Team`,
  },
  ...overrides,
})

export const nestedProjectFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.lorem.words(),
  project_code: investmentProjectCodeFaker(),
  ...overrides,
})

export const nestedCompanyFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.company.name(),
  ...overrides,
})

export const nestedInteractionFaker = (overrides = {}) => ({
  created_by: nestedAdviserFaker(),
  date: relativeDateFaker({ minDays: -365, maxDays: 0 }),
  kind: faker.helpers.arrayElement(['interaction', 'service_delivery']),
  subject: faker.datatype.string(),
  ...overrides,
})

export const reminderFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  created_on: relativeDateFaker({ minDays: -365, maxDays: 0 }),
  event: faker.lorem.words(),
  project: nestedProjectFaker(),
  ...overrides,
})

export const reminderListFaker = (
  length = 1,
  reminderFakerFunction = reminderFaker,
  overrides
) => listFaker({ fakerFunction: reminderFakerFunction, length, overrides })

export const exportReminderFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  created_on: relativeDateFaker({ minDays: -365, maxDays: 0 }),
  last_interaction_date: relativeDateFaker({ minDays: -365, maxDays: 0 }),
  event: faker.lorem.words(),
  company: nestedCompanyFaker(),
  interaction: nestedInteractionFaker(),
  ...overrides,
})

export default reminderListFaker
