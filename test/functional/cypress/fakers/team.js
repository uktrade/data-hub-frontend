import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const teamFaker = () => ({
  id: faker.string.uuid(),
  name: faker.person.jobDescriptor(),
})

const teamListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: teamFaker, length, overrides })

export { teamFaker, teamListFaker }

export default teamListFaker
