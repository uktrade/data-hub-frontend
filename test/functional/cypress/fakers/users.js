import { faker } from '@faker-js/faker'

const userFaker = (overrides) => {
  const first_name = faker.name.firstName()
  const last_name = faker.name.lastName()
  return {
    id: faker.datatype.uuid(),
    first_name,
    last_name,
    name: `${first_name} ${last_name}`,
    ...overrides,
  }
}

export { userFaker }
