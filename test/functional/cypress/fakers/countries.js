import { faker } from '../../../sandbox/utils.mjs'

import { listFaker } from './utils'

const countries = [
  'United Kingdom',
  'Zimbabwe',
  'Thailand',
  'Taiwan',
  'St Lucia',
  'The Bahamas',
]

export const countryFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(countries),
  ...overrides,
})

export const countryListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: countryFaker, length, overrides })

export default countryListFaker
