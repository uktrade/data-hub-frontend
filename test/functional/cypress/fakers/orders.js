import faker from 'faker'
import jsf from 'json-schema-faker'

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
  id: faker.datatype.uuid(),
  reference: faker.random.arrayElement(references),
  company: {
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    trading_names: [faker.company.companyName(), faker.company.companyName()],
  },
  contact: {
    ...userFaker(),
  },
  sector: sectorFaker(),
  uk_region: ukRegionFaker(),
  status: faker.random.arrayElement(status),
  primary_market: countryFaker(),
  created_on: faker.date.past(),
  modified_on: faker.date.past(),
  delivery_date: faker.random.arrayElement([null, faker.date.future()]),
  ...overrides,
})

const ordersListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: orderFaker, length, overrides })

export { orderFaker, ordersListFaker }

export default ordersListFaker
