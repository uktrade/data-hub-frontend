import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'
import {
  formatDate,
  DATE_FORMAT_ISO,
} from '../../../../src/client/utils/date-utils'

const objectiveFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  company: { id: faker.string.uuid(), name: faker.company.name() },
  subject: faker.word.sample(),
  detail: faker.word.words(),
  target_date: formatDate(faker.date.future(), DATE_FORMAT_ISO),
  has_blocker: true,
  blocker_description: faker.word.words(),
  progress: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
  archived: false,
  modifiedBy: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  modifiedOn: faker.date.past(),

  ...overrides,
})

const objectiveListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: objectiveFaker, length, overrides })

export { objectiveFaker, objectiveListFaker }

export default objectiveListFaker
