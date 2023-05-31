// TODO - the logic in this should be moved to the fakers folder once there is a real api to call

var ukRegion = require('../../../fixtures/v4/metadata/uk-region.json')
var employeeRange = require('../../../fixtures/v4/metadata/employee-range.json')
var headquarterType = require('../../../fixtures/v4/metadata/headquarter-type.json')

const { faker } = require('@faker-js/faker')

const address = {
  line_1: faker.location.streetAddress(),
  line_2: faker.location.street(),
  town: faker.location.city(),
  county: faker.location.county(),
  postcode: faker.location.zipCode(),
  country: {
    id: faker.string.uuid(),
    name: faker.location.country(),
  },
}

const companyTreeItemFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  duns_number: faker.helpers.rangeToNumber({
    min: 100000000,
    max: 999999999,
  }),
  name: faker.company.name(),
  number_of_employees: faker.helpers.rangeToNumber({
    min: 0,
    max: 15000,
  }),
  uk_region: faker.helpers.arrayElement(ukRegion),
  address: address, //This is called trading address on the designs
  registered_address: address,
  sector: [
    {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
    },
  ],
  latest_interaction_date: faker.date.past(),
  hierarchy: 1,
  subsidiaries: [],
  ...overrides,
})

const createCompanyTree = (
  treeDepth,
  minCompaniesPerLevel,
  maxCompaniesPerLevel
) => {
  const ultimateParent = companyTreeItemFaker({ id: undefined })

  createSubsidiary(
    ultimateParent,
    1,
    treeDepth,
    minCompaniesPerLevel,
    maxCompaniesPerLevel
  )

  return ultimateParent
}

const createSubsidiary = (
  company,
  currentDepth,
  maxDepth,
  minCompaniesPerLevel,
  maxCompaniesPerLevel
) => {
  if (currentDepth == maxDepth) {
    return
  }

  const calculatedMax = faker.datatype.number({
    min: minCompaniesPerLevel,
    max: maxCompaniesPerLevel,
  })

  const subsidiaryCompanies = []
  for (
    let comp_index = minCompaniesPerLevel;
    comp_index <= calculatedMax;
    comp_index++
  ) {
    const subsidiaryCompany = companyTreeItemFaker({
      hierarchy: currentDepth + 1,
    })
    createSubsidiary(
      subsidiaryCompany,
      currentDepth + 1,
      maxDepth,
      minCompaniesPerLevel,
      maxCompaniesPerLevel
    )
    subsidiaryCompanies.push(subsidiaryCompany)
  }
  company.subsidiaries = subsidiaryCompanies
}

exports.fakerCompanyFamilyTree = ({
  treeDepth = 2,
  minCompaniesPerLevel = 1,
  maxCompaniesPerLevel = 1,
}) => ({
  ultimate_global_company: createCompanyTree(
    treeDepth,
    minCompaniesPerLevel,
    maxCompaniesPerLevel
  ),
  ultimate_global_companies_count: 12,
  manually_verified_subsidiaries: [
    {
      id: faker.string.uuid(),
      name: faker.company.name(),
      employee_range: faker.helpers.arrayElement(employeeRange),
      headquarter_type: faker.helpers.arrayElement(headquarterType),
    },
  ],
})
