import { jsf } from '../../../sandbox/utils/random'
import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { ditTeamFaker } from './dit-team'

const adviserFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Adviser),
  dit_team: ditTeamFaker(),
  ...overrides,
})

const advisersListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: adviserFaker, length, overrides })

export { adviserFaker, advisersListFaker }

export default advisersListFaker
