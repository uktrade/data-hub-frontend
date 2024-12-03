import { faker } from '../../../utils.mjs'

import { listFaker } from './utils'

const companyExportWinFaker = () => ({
  id: faker.string.uuid(),
  title: faker.word.sample(),
  date: '2023-08-01',
  created: faker.date.past(),
  country: faker.location.country(),
  sector: 'Advanced engineering : Metallurgical process plant',
  business_potential: faker.helpers.arrayElement(['1', '2', '3']), // Double check this
  business_type: faker.helpers.arrayElement([
    'Order',
    'Contract',
    'Distributor',
    'Export sales',
    'joint venture',
    'outward investment',
  ]),
  name_of_export: 'Rolls Royce',
  lead_officer: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    team: {
      type: 'Trade (TD or ST)',
      sub_type: 'TD - Events - Financial & Professional Business Services',
    },
  },
  team_members: [
    {
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      name: faker.person.fullName(),
    },
    {
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      name: faker.person.fullName(),
    },
  ],
  contributing_advisers: [
    {
      id: faker.string.uuid(),
      adviser: {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        name: faker.person.fullName(),
      },
      name: faker.string.uuid(),
      location: faker.location.country(),
      team_type: {
        id: faker.string.uuid(),
        name: faker.person.jobDescriptor(),
      },
      hq_team: {
        id: faker.string.uuid(),
        name: faker.person.jobDescriptor(),
      },
    },
  ],
  contact: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    job_title: faker.person.jobTitle(),
  },
  value: {
    export: {
      total: 15,
      breakdowns: [
        {
          year: 2023,
          value: 1,
        },
        {
          year: 2024,
          value: 2,
        },
        {
          year: 2025,
          value: 3,
        },
        {
          year: 2026,
          value: 4,
        },
        {
          year: 2027,
          value: 5,
        },
      ],
    },
  },
  customer: '',
  response: {
    confirmed: true,
    date: faker.date.past(),
  },
  hvc: null,
})

const companyExportWinListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyExportWinFaker, length, overrides })

export { companyExportWinFaker, companyExportWinListFaker }

export default companyExportWinListFaker
