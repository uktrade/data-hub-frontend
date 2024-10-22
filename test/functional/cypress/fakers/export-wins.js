import { faker } from '@faker-js/faker'

import { contactFaker } from './contacts'
import { sectorFaker } from './sectors'

/**
 * Generate fake data for a single export win.
 */
export const exportWinsFaker = () => ({
  id: faker.string.uuid(),
  lead_officer: faker.person.fullName(),
  lead_officer: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
  },
  team_type: {
    name: 'Trade (TD or ST)',
    id: faker.string.uuid(),
  },
  hq_team: {
    id: faker.string.uuid(),
    name: 'TD - Events - Education',
  },
  team_members: [
    {
      id: faker.string.uuid(),
      name: 'David Luker',
      first_name: 'David',
      last_name: 'Luke',
    },
    {
      id: faker.string.uuid(),
      name: 'Kelly Shields',
      first_name: 'Kelly',
      last_name: 'Shields',
    },
  ],
  adviser: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  contributing_advisers: [],
  company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  country: {
    id: faker.string.uuid(),
    name: faker.location.country(),
  },
  customer_name: faker.person.fullName(),
  customer_location: {
    id: faker.string.uuid(),
    name: 'North West',
  },
  name_of_export: 'Rolls Royce',
  business_potential: {
    id: faker.string.uuid(),
    name: 'The company is an exporter with High Export Potential',
  },
  export_experience: {
    id: faker.string.uuid(),
    name: 'Exported before, but no exports in the last 12 months',
  },
  goods_vs_services: {
    id: faker.string.uuid(),
    name: 'Goods',
  },
  sector: sectorFaker(),
  type_of_support: [
    {
      id: faker.string.uuid(),
      name: 'Missions, tradeshows and events (DIT/FCO)',
    },
    {
      id: faker.string.uuid(),
      name: 'Lobbying to overcome a problem – DIT/FCO',
    },
  ],
  breakdowns: [
    {
      id: faker.string.uuid(),
      type: {
        name: 'Export',
        id: faker.string.uuid(),
      },
      year: 1,
      value: 10000000,
    },
  ],
  associated_programme: [
    {
      id: faker.string.uuid(),
      name: 'Afterburner',
    },
    {
      id: faker.string.uuid(),
      name: 'British Business Network',
    },
  ],
  hvc: {
    id: faker.string.uuid(),
    name: 'Australia & NZ Automotive: E001',
  },
  is_personally_confirmed: true,
  is_line_manager_confirmed: true,
  customer_job_title: faker.person.jobTitle(),
  customer_email_address: faker.internet.email(),
  company_contacts: [contactFaker()],
  total_expected_export_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  total_expected_non_export_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  total_expected_odi_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  date: faker.date.anytime().toISOString(),
  customer_response: {
    agree_with_win: null, // Pending
    responded_on: faker.date.anytime().toISOString(),
    expected_portion_without_help: {
      name: '40%',
    },
  },
})
