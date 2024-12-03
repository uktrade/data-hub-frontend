import { faker } from '../../../sandbox/utils'

import { listFaker } from './utils'
import { formatWithoutParsing } from '../../../../src/client/utils/date'
import { DATE_LONG_FORMAT_3 } from '../../../../src/common/constants'

const objectiveFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  company: { id: faker.string.uuid(), name: faker.company.name() },
  subject: faker.word.sample(),
  detail: faker.word.words(),
  target_date: formatWithoutParsing(faker.date.future(), DATE_LONG_FORMAT_3),
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
