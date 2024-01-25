import { faker } from '@faker-js/faker'

const fakeBreakdown = () => ({
  id: faker.string.uuid(),
  type: {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Export',
      'Business success',
      'Outward Direct Investment',
    ]),
  },
  value: faker.number.int({
    min: 1_000,
    max: 10_000_000,
  }),
  year: faker.number.int({
    min: 1,
    max: 5,
  }),
})

const fakeExportWin = () => ({
  id: faker.string.uuid(),
  adviser: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  },
  lead_officer: {
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
  company_contacts: [
    {
      id: faker.string.uuid(),
      name: faker.company.name(),
      email: faker.internet.email(),
    },
  ],
  customer_name: faker.person.fullName(),
  customer_job_title: faker.person.jobTitle(),
  customer_email_address: faker.internet.email(),
  total_expected_export_value: faker.number.int({
    min: 10_000,
    max: 10_000_000,
  }),
  date: faker.date.anytime(),
  customer_response: {
    created_on: faker.date.anytime(),
  },
  goods_vs_services: {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Goods', 'Services']),
  },
  breakdowns: faker.helpers.multiple(fakeBreakdown),
})

const WON_EXPORT_WINS = Array(123).fill().map(fakeExportWin)
const SENT_EXPORT_WINS = Array(123).fill().map(fakeExportWin)

export const getExportWinCollection = (req, res) => {
  const exportWins =
    req.query.filter === 'sent' ? SENT_EXPORT_WINS : WON_EXPORT_WINS

  const limit = parseInt(req.query.limit, 10)
  const offset = parseInt(req.query.offset, 10)

  res.json({
    count: exportWins.length,
    results: exportWins.slice(offset, offset + limit),
  })
}

export const getExportWin = (req, res) => {
  res.json(fakeExportWin())
}
