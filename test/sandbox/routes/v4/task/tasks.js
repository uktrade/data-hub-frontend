const { faker } = require('@faker-js/faker')

const generateTask = () => {
  return {
    id: faker.string.uuid(),
    title: faker.word.sample(),
    description: faker.word.words(),
    due_date: faker.date.future(),
    reminder_days: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
    email_reminders_enabled: true,
    advisers: [generatePerson, generatePerson],
    archived_by: null,
    created_by: generatePerson,
    modified_by: generatePerson,
  }
}

const generatePerson = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    first_name: firstName,
    last_name: lastName,
    name: firstName + ' ' + lastName,
  }
}

const generateTasks = () => {
  return {
    count: 3,
    next: null,
    previous: null,
    results: [...Array(3)].map(() => generateTask()),
  }
}

module.exports = { generateTasks }
