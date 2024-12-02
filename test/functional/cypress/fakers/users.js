import { faker } from '../../../utils'

const userFaker = (overrides) => {
  const first_name = faker.person.firstName()
  const last_name = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    first_name,
    last_name,
    name: `${first_name} ${last_name}`,
    ...overrides,
  }
}

export { userFaker }
