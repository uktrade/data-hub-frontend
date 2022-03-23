import { faker } from '@faker-js/faker'

const addressFaker = (overrides = {}) => ({
  line_1: faker.address.streetAddress(),
  line_2: faker.address.streetName(),
  town: faker.address.city(),
  county: faker.address.county(),
  postcode: faker.address.zipCode(),
  country: {
    id: faker.datatype.uuid(),
    name: faker.address.country(),
  },
  ...overrides,
})

export { addressFaker }
