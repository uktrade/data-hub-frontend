// TODO - the logic in this should be moved to the fakers folder once there is a real api to call

import { faker } from '../../../utils.mjs'
import ukRegion from '../../../fixtures/v4/metadata/uk-region.json' assert { type: 'json' }
import employeeRange from '../../../fixtures/v4/metadata/employee-range.json' assert { type: 'json' }
import headquarterType from '../../../fixtures/v4/metadata/headquarter-type.json' assert { type: 'json' }
import oneListTier from '../../../fixtures/v4/metadata/one-list-tier.json' assert { type: 'json' }

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
  one_list_tier: faker.helpers.arrayElement(oneListTier),
  archived: false,
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
  const companiesCount = (
    JSON.stringify(ultimateParent).match(/duns_number/g) || []
  ).length
  return {
    ultimate_global_company: ultimateParent,
    ultimate_global_companies_count: companiesCount,
    family_tree_companies_count: companiesCount,
    reduced_tree: false,
  }
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

  const calculatedMax = faker.number.int({
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

const manuallyLinkedCompanyFaker = () => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    employee_range: faker.helpers.arrayElement(employeeRange),
    headquarter_type: faker.helpers.arrayElement(headquarterType),
    address: address,
    uk_region: faker.helpers.arrayElement(ukRegion),
    one_list_tier: faker.helpers.arrayElement(oneListTier),
    archived: false,
    hierarchy: 0,
  }
}

export const fakerCompanyFamilyTree = ({
  treeDepth = 2,
  minCompaniesPerLevel = 1,
  maxCompaniesPerLevel = 1,
  minManuallyVerifiedSubsidiaries = 1,
  maxManuallyVerifiedSubsidiaries = 3,
}) => {
  const numberManuallyVerifiedSubsidiaries = faker.number.int({
    min: minManuallyVerifiedSubsidiaries,
    max: maxManuallyVerifiedSubsidiaries,
  })
  return {
    ...createCompanyTree(treeDepth, minCompaniesPerLevel, maxCompaniesPerLevel),
    manually_verified_subsidiaries: [
      ...new Array(numberManuallyVerifiedSubsidiaries),
    ].map(manuallyLinkedCompanyFaker),
  }
}
