import { faker } from '@faker-js/faker'

import { relativeDateFaker } from './dates'
import { investmentProjectCodeFaker } from './investment-projects'
import { listFaker } from './utils'

export const nestedProjectFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.lorem.words(),
  project_code: investmentProjectCodeFaker(),
  ...overrides,
})

export const reminderFaker = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  created_on: relativeDateFaker({ minDays: -365, maxDays: 0 }),
  event: faker.lorem.words(),
  project: nestedProjectFaker(),
  ...overrides,
})

export const reminderListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: reminderFaker, length, overrides })

export default reminderListFaker
