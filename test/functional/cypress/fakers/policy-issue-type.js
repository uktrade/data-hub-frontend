import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'

const policyIssueTypeFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.jobArea(),
  disabled_on: null,
  ...overrides,
})

const policyIssueTypeListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: policyIssueTypeFaker, length, overrides })

export { policyIssueTypeFaker, policyIssueTypeListFaker }

export default policyIssueTypeListFaker
