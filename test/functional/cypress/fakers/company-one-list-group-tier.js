import { faker } from '../../../utils'

import { listFaker } from './utils'

const companyOneListgroupTierFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.jobArea(),
  disabled_on: null,
  ...overrides,
})

const companyOneListgroupTierListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyOneListgroupTierFaker, length, overrides })

export { companyOneListgroupTierFaker, companyOneListgroupTierListFaker }

export default companyOneListgroupTierListFaker
