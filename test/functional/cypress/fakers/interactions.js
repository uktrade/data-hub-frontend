import { faker, jsf } from '../../../utils'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import teamFaker from './team'

const interactionFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Interaction),
  companies: [
    {
      trading_names: [],
      name: faker.company.name(),
      id: faker.string.uuid(),
    },
  ],
  contacts: [userFaker()],
  dit_participants: [
    {
      adviser: userFaker(),
      team: teamFaker(),
    },
  ],
  service: {
    name: faker.lorem.words(),
    id: faker.string.uuid(),
  },
  ...overrides,
})

const interactionsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: interactionFaker, length, overrides })

export { interactionFaker, interactionsListFaker }

export default interactionsListFaker
