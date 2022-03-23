import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

export const administrativeAreaFaker = () => ({
  id: faker.datatype.uuid(),
  name: faker.address.state(),
  country: {
    name: faker.address.country(),
    id: faker.datatype.uuid(),
  },
  area_code: faker.address.stateAbbr(),
  disabled_on: null,
})

export const administrativeAreaListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: administrativeAreaFaker, length, overrides })

export default administrativeAreaListFaker
