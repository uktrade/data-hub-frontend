import { faker } from '@faker-js/faker'

import { contactFaker } from './contacts'

/**
 * Generate fake data for a single export win.
 */
export const exportWinsFaker = () => ({
  id: faker.string.uuid(),
  adviser: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  country: {
    id: faker.string.uuid(),
    name: faker.location.country(),
  },
  customer_name: faker.person.fullName(),
  customer_job_title: faker.person.jobTitle(),
  customer_email_address: faker.internet.email(),
  company_contacts: [contactFaker()],
  total_expected_export_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  date: faker.date.anytime().toISOString(),
  customer_response: {
    responded_on: faker.date.anytime().toISOString(),
  },
})
