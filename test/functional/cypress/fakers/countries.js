import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const countries = [
  'United Kingdom',
  'Zimbabwe',
  'Thailand',
  'Taiwan',
  'St Lucia',
  'The Bahamas',
]

export const countryFaker = () => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(countries),
})

export const countryListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: countryFaker, length, overrides })

export default countryListFaker
