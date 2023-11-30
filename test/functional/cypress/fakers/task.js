import { faker } from '@faker-js/faker'
import { pick } from 'lodash'

import { listFaker } from './utils'
import { investmentProjectFaker } from './investment-projects'

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
  archived: true,
  archivedBy: null,
  createdBy: basicAdviserFaker(),
  modifiedBy: basicAdviserFaker(),
  modifiedOn: faker.date.past().toISOString(),
  createdOn: faker.date.past().toISOString(),
  investmentProjectTask: null,

  ...overrides,
})

const taskWithInvestmentProjectFaker = (overrides = {}) =>
  taskFaker(
    (overrides = {
      investmentProject: {
        investorCompany: {
          name: faker.company.name(),
          id: faker.string.uuid(),
        },
        id: faker.string.uuid(),
        name: faker.word.adjective(),
      },
      id: faker.string.uuid(),
      name: faker.word.adjective(),
      ...overrides,
    })
  )

const taskWithInvestmentProjectNotCompleteFaker = (overrides = {}) =>
  taskWithInvestmentProjectFaker(
    (overrides = {
      archived: false,

      ...overrides,
    })
  )

const investmentProjectTaskFaker = (overrides = {}) =>
  taskFaker(
    (overrides = {
      investment_project: pick(investmentProjectFaker(), ['id', 'name']),
      createdOn: faker.date.past().toISOString(),
      ...overrides,
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

const investmentProjectTaskListFaker = (length = 3, overrides) =>
  listFaker({
    fakerFunction: investmentProjectTaskFaker,
    length,
    overrides,
  })

export {
  taskFaker,
  taskListFaker,
  investmentProjectTaskFaker,
  taskWithInvestmentProjectFaker,
  taskWithInvestmentProjectNotCompleteFaker,
  taskWithInvestmentProjectListFaker,
  investmentProjectTaskListFaker,
  basicAdviserFaker,
}

export default taskListFaker
