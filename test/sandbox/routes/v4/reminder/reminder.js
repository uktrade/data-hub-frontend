const { faker } = require('@faker-js/faker')

var summary = require('../../../fixtures/v4/reminder/summary.json')

const myTasksDueDateApproachingReminderFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  created_on: faker.date.past({ years: 1 }),
  event: faker.lorem.words(),
  task: {
    id: faker.string.uuid(),
    due_date: faker.date.future({ years: 1 }),
    investment_project_task: {
      id: faker.string.uuid(),
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
  },
  ...overrides,
})

const myTasksDueDateApproachingReminderListFaker = (
  length = 10,
  overrides = {}
) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list.push(myTasksDueDateApproachingReminderFaker(overrides))
  }
  return list
}

exports.summary = function (req, res) {
  res.json(summary)
}

exports.myTasksDueDateApproaching = function (req, res) {
  const count = 11
  res.json({
    count: count,
    next: null,
    previous: null,
    results: myTasksDueDateApproachingReminderListFaker(count),
  })
}
