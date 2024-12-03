import { faker } from '../../../sandbox/utils.mjs'

const addressFaker = (overrides = {}) => ({
  line_1: faker.location.streetAddress(),
  line_2: faker.location.street(),
  town: faker.location.city(),
  county: faker.location.county(),
  postcode: faker.location.zipCode(),
  country: {
    id: faker.string.uuid(),
    name: faker.location.country(),
  },
  ...overrides,
})

export { addressFaker }
