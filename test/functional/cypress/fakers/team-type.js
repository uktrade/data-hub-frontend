import { faker } from '../../../utils'

import { listFaker } from './utils'

const teamTypeFaker = () => ({
  id: faker.string.uuid(),
  name: faker.person.jobDescriptor(),
})

const teamTypeListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: teamTypeFaker, length, overrides })

export { teamTypeFaker, teamTypeListFaker }

export default teamTypeListFaker
