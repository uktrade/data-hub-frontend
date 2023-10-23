const { faker } = require('@faker-js/faker')

const { addDays } = require('../../../../../src/client/utils/date')
var summary = require('../../../fixtures/v4/reminder/summary.json')

const myTasksDueDateApproachingReminderFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  created_on: faker.date.between({
    from: addDays(new Date(), 0),
    to: addDays(new Date(), 365),
  }),
  event: faker.lorem.words(),
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
    task: {
      id: faker.string.uuid(),
      due_date: faker.date.between({
        from: addDays(new Date(), 0),
        to: addDays(new Date(), 365),
      }),
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
  res.json({
    count: 1,
    next: null,
    previous: null,
    results: myTasksDueDateApproachingReminderListFaker(),
  })
}
