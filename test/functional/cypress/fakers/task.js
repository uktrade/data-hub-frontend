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
  dueDate: faker.date.future().toISOString(),
  reminderDays: faker.helpers.rangeToNumber({ min: 0, max: 365 }),
  emailRemindersEnabled: true,
  advisers: [...Array(3)].map(() => basicAdviserFaker()),
  archived: false,
  archivedBy: null,
  createdBy: basicAdviserFaker(),
  modifiedBy: basicAdviserFaker(),
  modifiedOn: faker.date.past().toISOString(),
  createdOn: faker.date.past().toISOString(),
  investmentProjectTask: null,

  ...overrides,
})

const investmentProjectTaskFaker = (overrides = {}) =>
  taskFaker(
    (overrides = {
      ...overrides,
      investmentProjectTask: {
        investmentProject: {
          investorCompany: {
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
    fakerFunction: investmentProjectTaskFaker,
    length,
    overrides,
  }).concat(listFaker({ fakerFunction: taskFaker, length, overrides }))

const investmentProjectTaskListFaker = (length = 3, overrides) =>
  listFaker({ fakerFunction: investmentProjectTaskFaker, length, overrides })

export {
  taskFaker,
  taskListFaker,
  investmentProjectTaskFaker,
  investmentProjectTaskListFaker,
}

export default taskListFaker
