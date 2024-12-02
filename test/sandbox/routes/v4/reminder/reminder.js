import { faker } from '../../../../utils'

import summary from '../../../fixtures/v4/reminder/summary.json' assert { type: 'json' }

const myTasksReminderFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  created_on: faker.date.past({ years: 1 }),
  event: faker.lorem.words(),
  task: {
    id: faker.string.uuid(),
    due_date: faker.date.future({ years: 1 }),
    investment_project: {
      id: faker.string.uuid(),
      name: faker.lorem.words(),
      project_code: 'DHP-12345678',
      investor_company: {
        id: faker.string.uuid(),
        name: faker.company.name(),
      },
    },
  },
  ...overrides,
})

const myTasksReminderListFaker = (length = 10, overrides = {}) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list.push(myTasksReminderFaker(overrides))
  }
  return list
}

export const getSummary = function (req, res) {
  res.json(summary)
}

export const myTasks = function (req, res) {
  const count = 11
  res.json({
    count: count,
    next: null,
    previous: null,
    results: myTasksReminderListFaker(count),
  })
}
