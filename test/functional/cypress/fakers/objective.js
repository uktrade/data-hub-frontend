import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const objectiveFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  company: { id: faker.string.uuid(), name: faker.company.name() },
  subject: faker.word.sample(),
  detail: faker.word.words(),
  target_date: faker.date.future(),
  has_blocker: true,
  blocker_description: faker.word.words(),
  progress: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
  ...overrides,
})

const objectiveListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: objectiveFaker, length, overrides })

export { objectiveFaker, objectiveListFaker }

export default objectiveListFaker
