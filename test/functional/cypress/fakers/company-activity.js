import { faker } from '@faker-js/faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import teamFaker from './team'

const companyActivityFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Company),
  id: faker.string.uuid(),
  activity_source: 'interaction',
  company: {
    name: faker.word.adjective(),
    id: faker.string.uuid(),
    trading_name: faker.word.adjective(),
  },
  interaction: {
    contacts: [userFaker()],
    dit_participants: [
      {
        adviser: userFaker(),
        team: teamFaker(),
      },
    ],
    kind: faker.word.adjective(),
    subject: faker.word.words(),
    service: {
      name: faker.lorem.words(),
      id: faker.string.uuid(),
    },
    communication_channel: {
      id: faker.string.uuid(),
      name: 'email/website',
    },
  },
  referral: null,
  ...overrides,
})

const companyActivityListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyActivityFaker, length, overrides })

export { companyActivityFaker, companyActivityListFaker }

export default companyActivityListFaker
