import { faker } from '@faker-js/faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import teamFaker from './team'

const companyFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.CompanyActivity),
  name: faker.company.name(),
  id: faker.string.uuid(),
  activities: {
    count: faker.number.int({ min: 1, max: 50 }),
    results: [],
  },
  ...overrides,
})

const companyActivityFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  contacts: [userFaker()],
  dit_participants: [
    {
      adviser: userFaker(),
      team: teamFaker(),
    },
  ],
  subject: faker.word.words(),
  service: {
    name: faker.lorem.words(),
    id: faker.string.uuid(),
  },
  communication_channel: {
    id: faker.string.uuid(),
    name: 'email/website',
  },
  ...overrides,
})

const companyActivityListFaker = (length = 1, overrides) => {
  const company = companyFaker()
  company.activities.results = listFaker({
    fakerFunction: companyActivityFaker,
    length,
    overrides,
  })
  company.activities.count = length
  return company
}

export { companyActivityFaker, companyActivityListFaker }

export default companyActivityListFaker
