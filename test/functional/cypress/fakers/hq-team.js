import { faker } from '../../../utils.mjs'

import { listFaker } from './utils'

const hqTeamFaker = () => ({
  id: faker.string.uuid(),
  name: faker.person.jobDescriptor(),
})

const hqTeamListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: hqTeamFaker, length, overrides })

export { hqTeamFaker, hqTeamListFaker }

export default hqTeamListFaker
