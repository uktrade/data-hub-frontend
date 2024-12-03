import { startCase } from 'lodash'

import { faker, jsf } from '../../../utils.mjs'

import apiSchema from '../../../api-schema.json'

import { relativeDateFaker } from './dates'
import { listFaker } from './utils'
import { investmentProjectCodeFaker } from './investment-projects'

/**
 * Generate fake data for a single proposition.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const propositionFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Proposition),
  id: faker.string.uuid(),
  name: startCase(faker.word.words()),
  deadline: relativeDateFaker({ minDays: -100, maxDays: 365 }),
  investment_project: {
    name: startCase(faker.word.words()),
    project_code: investmentProjectCodeFaker(),
    id: faker.string.uuid(),
  },
  ...overrides,
})

/**
 * Generate fake data for a list of propositions.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const propositionListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: propositionFaker, length, overrides })

export { propositionFaker, propositionListFaker }

export default propositionListFaker
