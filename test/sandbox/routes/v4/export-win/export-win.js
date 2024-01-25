import { faker } from '@faker-js/faker'

const fakeExportWin = () => ({
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
