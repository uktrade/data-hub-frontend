import { pick } from 'lodash'

import { faker } from '../../../utils'

import { listFaker } from './utils'
import { companyFaker } from './companies'
import { interactionFaker } from './interactions'
import { STATUS } from '../../../../src/client/modules/Tasks/TaskForm/constants'

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
  dueDate: faker.date.future({ years: 3 }).toISOString(),
  reminderDays: faker.helpers.rangeToNumber({ min: 0, max: 365 }),
  emailRemindersEnabled: true,
  advisers: [...Array(3)].map(() => basicAdviserFaker()),
  interaction: null,
  archived: false,
  archivedBy: null,
  createdBy: basicAdviserFaker(),
  modifiedBy: basicAdviserFaker(),
  modifiedOn: faker.date.past().toISOString(),
  createdOn: faker.date.past().toISOString(),
  status: STATUS.ACTIVE,

  ...overrides,
})

const taskWithInvestmentProjectFaker = (
  overrides = {},
  investmentProjectOverrides = {}
) => {
  const company = pick(companyFaker(), ['id', 'name'])

  return taskFaker(
    (overrides = {
      investmentProject: {
        investorCompany: company,
        id: faker.string.uuid(),
        name: faker.word.adjective(),
        ...investmentProjectOverrides,
      },
      company: company,
      ...overrides,
    })
  )
}

const taskWithInteractionFaker = (overrides = {}) => {
  const company = pick(companyFaker(), ['id', 'name'])
  const interaction = pick(
    interactionFaker({
      companies: [
        {
          name: company.name,
          id: company.id,
        },
      ],
    }),
    ['subject', 'id']
  )

  return taskFaker(
    (overrides = {
      company: company,
      interaction: interaction,
      ...overrides,
    })
  )
}

const taskWithCompanyFaker = (overrides = {}) =>
  taskFaker(
    (overrides = {
      company: companyFaker(),
      ...overrides,
    })
  )

const taskListFaker = (length = 3, overrides) =>
  listFaker({
    fakerFunction: taskWithInvestmentProjectFaker,
    length,
    overrides,
  })

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
  taskWithInteractionFaker,
  basicAdviserFaker,
  taskWithCompanyFaker,
}

export default taskListFaker
