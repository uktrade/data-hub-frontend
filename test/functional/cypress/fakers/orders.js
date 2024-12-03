import { jsf, faker } from '../../../sandbox/utils'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'
import { countryFaker } from './countries'
import { ukRegionFaker } from './regions'
import { sectorFaker } from './sectors'

const status = [
  'draft',
  'quote_awaiting_acceptance',
  'quote_accepted',
  'paid',
  'complete',
  'cancelled',
]

const references = [
  'UAF873/21',
  'JTK146/20',
  'JCJ722/20',
  'RNA947/20',
  'NFV737/20',
  'HTT293/20',
  'UCC868/20',
  'YWA437/20',
]

const orderFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Order),
  id: faker.string.uuid(),
  reference: faker.helpers.arrayElement(references),
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
    trading_names: [faker.company.name(), faker.company.name()],
  },
  contact: {
    ...userFaker(),
  },
  sector: sectorFaker(),
  uk_region: ukRegionFaker(),
  status: faker.helpers.arrayElement(status),
  primary_market: countryFaker(),
  created_on: faker.date.past(),
  modified_on: faker.date.past(),
  delivery_date: faker.helpers.arrayElement([null, faker.date.future()]),
  ...overrides,
})

const ordersListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: orderFaker, length, overrides })

export { orderFaker, ordersListFaker }

export default ordersListFaker
