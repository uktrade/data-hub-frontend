import { faker } from '../../../sandbox/utils.mjs'

import { listFaker } from './utils'

const DIT_TEAM_NAMES = [
  'Digital Data Hub - Live Service',
  'Aberdeen City Council',
  'Healthcare UK',
]

const ditTeamFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(DIT_TEAM_NAMES),
  ...overrides,
})

const ditTeamsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: ditTeamFaker, length, overrides })

export { ditTeamFaker, ditTeamsListFaker }

export default ditTeamsListFaker
