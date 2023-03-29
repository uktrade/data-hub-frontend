const { faker } = require('@faker-js/faker')
var sector = require('../../../fixtures/v4/metadata/sector.json')
var country = require('../../../fixtures/v4/metadata/country.json')
const exporterExperience = require('../../../fixtures/v4/export/export-experience.json')
const estimatedYears = require('../../../fixtures/v4/export/estimated-years.json')

const generateExport = () => {
  const { id: sectorId, name: sectorName } = faker.helpers.arrayElement(sector)
  const { id: countryId, name: countryName } =
    faker.helpers.arrayElement(country)
  const { id: exportExperienceId } =
    faker.helpers.arrayElement(exporterExperience)

  return {
    // id: faker.datatype.uuid(),
    id: '402b4745-96fb-4c9f-aa07-111e09faa8dd',
    company: { id: faker.datatype.uuid(), name: faker.company.name() },
    owner: { id: faker.datatype.uuid(), name: faker.name.fullName() },
    team_members: [
      { id: faker.datatype.uuid(), name: faker.name.fullName() },
      { id: faker.datatype.uuid(), name: faker.name.fullName() },
    ],
    contacts: { id: faker.datatype.uuid(), name: faker.name.fullName() },
    destination_country: {
      id: countryId,
      name: countryName,
    },
    sector: { id: sectorId, name: sectorName },
    exporter_experience: exportExperienceId,
    estimated_export_value_years: faker.helpers.arrayElement(estimatedYears),
    created_on: faker.date.past(),
    modified_on: faker.date.past(),
    title: faker.random.word(),
    estimated_export_value_amount: faker.random.numeric(6),
    estimated_win_date: faker.date.future(),
    export_potential: faker.helpers.arrayElement(['high', 'medium', 'low']),
    status: faker.helpers.arrayElement(['active', 'won', 'inactive']),
    notes: faker.random.words(25),
    created_by: faker.datatype.uuid(),
    modified_by: faker.datatype.uuid(),
  }
}
const generateExports = (count = 10) => {
  return {
    count: count,
    next: null,
    previous: null,
    results: [...Array.from({ length: count })].map(generateExport),
  }
}

const exportItems = generateExports(20)

module.exports = { exportItems, generateExport }
