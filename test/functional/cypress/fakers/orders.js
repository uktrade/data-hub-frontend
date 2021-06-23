import faker from 'faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import { userFaker } from './users'

const ukRegions = ['London', 'South East', 'North West']

const sectorNames = [
  'Advanced Engineering',
  'Biotechnology and Pharmaceuticals',
  'Creative and Media',
]

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

const countries = [
  {
    id: faker.datatype.uuid(),
    name: 'Zimbabwe',
  },
  {
    id: faker.datatype.uuid(),
    name: 'Thailand',
  },
  {
    id: faker.datatype.uuid(),
    name: 'Taiwan',
  },
  {
    id: faker.datatype.uuid(),
    name: 'St Lucia',
  },
  {
    id: faker.datatype.uuid(),
    name: 'The Bahamas',
  },
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
  sector: {
    name: faker.random.arrayElement(sectorNames),
    id: faker.datatype.uuid(),
    ancestors: [],
  },
  uk_region: {
    name: faker.random.arrayElement(ukRegions),
    id: faker.datatype.uuid(),
  },
  status: faker.random.arrayElement(status),
  primary_market: faker.random.arrayElement(countries),
  created_on: faker.date.past(),
  modified_on: faker.date.past(),
  delivery_date: faker.random.arrayElement([null, faker.date.future()]),
  ...overrides,
})

const ordersListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: orderFaker, length, overrides })

export { orderFaker, ordersListFaker }

export default ordersListFaker
