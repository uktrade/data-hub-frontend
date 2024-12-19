import { faker } from '../../../sandbox/utils/random'

import { contactFaker } from './contacts'
import { sectorFaker } from './sectors'
import { adviserFaker } from './advisers'
import { teamTypeFaker } from './team-type'
import { hqTeamFaker } from './hq-team'
/**
 * Overriding fake object data for legacy export win.
 */
const emptyCompanyContactObj = {
  company_contacts: [],
}

const legacyCustomerContactObj = {
  customer_name: faker.person.fullName(),
  customer_email_address: faker.internet.email(),
  customer_job_title: faker.person.jobTitle(),
}

const emptyLegacyCustomerContactObj = {
  customer_name: '',
  customer_email_address: '',
  customer_job_title: '',
}

const emptyCompanyObj = {
  company: {},
}

const legacyCompanyNameObj = {
  company_name: faker.company.name(),
}

const emptyLegacyCompanyNameObj = {
  company_name: '',
}

const emptyLeadOfficerObj = {
  lead_officer: {},
}

const legacyLeadOfficerNameObj = {
  lead_officer_name: faker.person.fullName(),
  lead_officer_email_address: faker.internet.email(),
}

const emptyLegacyLeadOfficerNameObj = {
  lead_officer_name: '',
  lead_officer_email_address: '',
}

const contributingAdvisersObj = {
  adviser: adviserFaker(),
}

const emptyContributingAdviserObj = {
  adviser: {},
}

const legacyContributingAdviserNameObj = {
  name: faker.person.fullName(),
  team_type: teamTypeFaker(),
  hq_team: hqTeamFaker(),
  location: faker.person.jobArea,
}

const emptyLegacyContributingAdviserNameObj = {
  name: '',
  team_type: teamTypeFaker(),
  hq_team: hqTeamFaker(),
  location: faker.person.jobArea,
}

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
  date: '2023-05-01',
  modified_on: faker.date.past().toISOString(),
  first_sent: faker.date.past().toISOString(),
  last_sent: faker.date.past().toISOString(),
  customer_response: {
    agree_with_win: null, // Pending
    responded_on: faker.date.past().toISOString(),
    expected_portion_without_help: {
      name: '40%',
    },
  },
})

/**
 * Generate fake data for legacy export win.
 */
export const exportWinsFakerEmptyCompanyContact = () => ({
  ...exportWinsFaker,
  ...emptyCompanyContactObj,
  ...legacyCustomerContactObj,
})

export const exportWinsFakerEmptyCompanyContactAndCustomerContact = () => ({
  ...exportWinsFaker,
  ...emptyCompanyContactObj,
  ...emptyLegacyCustomerContactObj,
})

export const exportWinsFakerEmptyCompany = () => ({
  ...exportWinsFaker,
  ...emptyCompanyObj,
  ...legacyCompanyNameObj,
})

export const exportWinsFakerEmptyCompanyAndCompanyName = () => ({
  ...exportWinsFaker,
  ...emptyCompanyObj,
  ...emptyLegacyCompanyNameObj,
})

export const exportWinsFakerEmptyLeadOfficer = () => ({
  ...exportWinsFaker,
  ...emptyLeadOfficerObj,
  ...legacyLeadOfficerNameObj,
})

export const exportWinsFakerEmptyLeadOfficerAndLeadOfficerName = () => ({
  ...exportWinsFaker,
  ...emptyLeadOfficerObj,
  ...emptyLegacyLeadOfficerNameObj,
})

export const exportWinsFakerWithContributingAdvisers = () => ({
  ...exportWinsFaker,
  contributing_advisers: [
    {
      ...contributingAdvisersObj,
      ...emptyLegacyContributingAdviserNameObj,
    },
  ],
})

export const exportWinsFakerEmptyContributingAdvisers = () => ({
  ...exportWinsFaker,
  contributing_advisers: [
    {
      ...emptyContributingAdviserObj,
      ...legacyContributingAdviserNameObj,
    },
  ],
})

export const exportWinsFakerEmptyContributingAdvisersAndName = () => ({
  ...exportWinsFaker,
  contributing_advisers: [
    {
      ...emptyContributingAdviserObj,
      ...emptyLegacyContributingAdviserNameObj,
    },
  ],
})
