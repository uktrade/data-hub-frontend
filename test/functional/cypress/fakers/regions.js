import faker from 'faker'

const ukRegions = [
  'All',
  'East Midlands',
  'East of England',
  'London',
  'North East',
  'North West',
  'Northern Ireland',
  'Scotland',
  'South East',
  'South West',
  'UKTI Dubai Hub',
  'Wales',
  'West Midlands',
  'Yorkshire and the Humber',
]

export const ukRegionFaker = () => ({
  id: faker.datatype.uuid(),
  name: faker.random.arrayElement(ukRegions),
})
