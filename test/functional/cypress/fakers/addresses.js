import faker from 'faker'

const addressFaker = (overrides = {}) => ({
  line_1: faker.address.streetAddress(),
  line_2: faker.address.streetName(),
  town: faker.address.city(),
  county: faker.address.county(),
  postcode: 'AB1 2DE',
  country: {
    id: faker.datatype.uuid(),
    name: faker.address.country(),
  },
  ...overrides,
})

export { addressFaker }
