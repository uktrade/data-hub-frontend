// TODO - the logic in this should be moved to the fakers folder once there is a real api to call

import { faker } from '../../../utils/random.js'

export const generateTask = (overrides = {}) => {
  return {
    id: faker.string.uuid(),
    title: faker.word.sample(),
    description: faker.word.words(),
    due_date: faker.date.future(),
    reminder_days: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
    email_reminders_enabled: true,
    advisers: [generatePerson(), generatePerson()],
    archived_by: null,
    created_by: generatePerson(),
    modified_by: generatePerson(),
    modified_on: faker.date.past().toISOString(),
    created_on: faker.date.past().toISOString(),
    ...overrides,
  }
}

export const generatePerson = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    first_name: firstName,
    last_name: lastName,
    name: firstName + ' ' + lastName,
  }
}

export const generateTasks = () => {
  return {
    count: 3,
    next: null,
    previous: null,
    results: [...Array(3)].map(() => generateTask()),
  }
}

export const generateCompaniesAndProjects = () => {
  return {
    companies: [
      {
        id: faker.string.uuid(),
        name: faker.company.name(),
      },
      {
        id: faker.string.uuid(),
        name: faker.company.name(),
      },
    ],
    projects: [],
  }
}
