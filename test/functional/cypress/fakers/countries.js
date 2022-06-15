import { faker } from '@faker-js/faker'

const countries = [
  'United Kingdom',
  'Zimbabwe',
  'Thailand',
  'Taiwan',
  'St Lucia',
  'The Bahamas',
]

export const countryFaker = () => ({
  id: faker.datatype.uuid(),
  name: faker.helpers.arrayElement(countries),
})
