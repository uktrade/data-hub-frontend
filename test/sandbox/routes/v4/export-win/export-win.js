const { faker } = require('@faker-js/faker')

const fakeExportWin = (_, i) => ({
  id: `export-win-id-#${i}`,
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
  total_expected_export_value: faker.number.int(),
  date: faker.date.anytime(),
})

const CONFIRMED_EXPORT_WINS = Array(123).fill().map(fakeExportWin)
const UNCONFIRMED_EXPORT_WINS = Array(123).fill().map(fakeExportWin)

const getExportWinCollection = (req, res) => {
  const exportWins =
    req.query.filter === 'unconfirmed'
      ? UNCONFIRMED_EXPORT_WINS
      : CONFIRMED_EXPORT_WINS

  const limit = parseInt(req.query.limit, 10)
  const offset = parseInt(req.query.offset, 10)

  res.json({
    count: exportWins.length,
    results: exportWins.slice(offset, offset + limit),
  })
}

module.exports = {
  getExportWinCollection,
}
