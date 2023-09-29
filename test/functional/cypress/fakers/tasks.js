import { faker } from '@faker-js/faker'

import { listFaker } from './utils'

const basicAdviserFaker = (overrides = {}) => ({
  name: faker.person.fullName(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  id: faker.string.uuid(),

  ...overrides,
})

const taskFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  title: faker.word.sample(),
  description: faker.word.words(),
  due_date: faker.date.future().toISOString(),
  reminder_days: faker.helpers.rangeToNumber({ min: 0, max: 365 }),
  email_reminders_enabled: true,
  advisers: [...Array(3)].map(() => basicAdviserFaker()),
  archived: false,
  archived_by: null,
  created_by: basicAdviserFaker(),
  modified_by: basicAdviserFaker(),
  modified_on: faker.date.past().toISOString(),
  created_on: faker.date.past().toISOString(),
  investment_project_task: null,

  ...overrides,
})

const taskWithInvestmentProjectFaker = (overrides = {}) =>
  taskFaker(
    (overrides = {
      ...overrides,
      investment_project_task: {
        investment_project: {
          investor_company: {
            name: faker.company.name(),
            id: faker.string.uuid(),
          },
          id: faker.string.uuid(),
        },
        id: faker.string.uuid(),
      },
    })
  )

const taskListFaker = (length = 3, overrides) =>
  listFaker({
    fakerFunction: taskWithInvestmentProjectFaker,
    length,
    overrides,
  }).concat(listFaker({ fakerFunction: taskFaker, length, overrides }))

const taskWithInvestmentProjectListFaker = (length = 3, overrides) =>
  listFaker({
    fakerFunction: taskWithInvestmentProjectFaker,
    length,
    overrides,
  })

export {
  taskFaker,
  taskListFaker,
  taskWithInvestmentProjectFaker,
  taskWithInvestmentProjectListFaker,
}

export default taskListFaker
