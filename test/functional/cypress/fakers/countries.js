import faker from 'faker'

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
  name: faker.random.arrayElement(countries),
})
