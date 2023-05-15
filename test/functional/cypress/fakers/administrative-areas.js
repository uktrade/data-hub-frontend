import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

export const administrativeAreaFaker = () => ({
  id: faker.string.uuid(),
  name: faker.location.state(),
  country: {
    name: faker.location.country(),
    id: faker.string.uuid(),
  },
  area_code: faker.location.stateAbbr(),
  disabled_on: null,
})

export const administrativeAreaListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: administrativeAreaFaker, length, overrides })

export default administrativeAreaListFaker
