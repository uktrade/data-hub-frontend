import faker from 'faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'

import { addressFaker } from './addresses'
import { listFaker } from './utils'

/**
 * Generate fake data for a single company.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const companyFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Company),
  id: faker.datatype.uuid(),
  address: addressFaker(),
  registered_address: addressFaker(),
  ...overrides,
})

/**
 * Generate fake data for a list of companies.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const companyListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyFaker, length, overrides })

export { companyFaker, companyListFaker }

export default companyListFaker
