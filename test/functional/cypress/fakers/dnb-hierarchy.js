import { faker } from '@faker-js/faker'

import { listFaker } from './utils'
import { addressFaker } from './addresses'
import { ukRegionFaker } from './regions'
import { EMPLOYEE_RANGE, HEADQUARTER_TYPE, ONE_LIST_TIER } from './constants'

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
  uk_region: ukRegionFaker(),
  address: addressFaker(), //This is called trading address on the designs
  registered_address: addressFaker(),
  sector: [
    {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
    },
  ],
  latest_interaction_date: faker.date.past(),
  one_list_tier: faker.helpers.arrayElement(ONE_LIST_TIER),
  archived: false,
  hierarchy: 1,
  subsidiaries: [],
  ...overrides,
})

const companyTreeItemListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: companyTreeItemFaker, length, overrides })

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

  return {
    ultimate_global_company: ultimateParent,
    ultimate_global_companies_count: (
      JSON.stringify(ultimateParent).match(/duns_number/g) || []
    ).length,
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

const companyTreeFaker = ({
  treeDepth = 2,
  minCompaniesPerLevel = 1,
  maxCompaniesPerLevel = 1,
  globalCompany = createCompanyTree(
    treeDepth,
    minCompaniesPerLevel,
    maxCompaniesPerLevel
  ),
}) => ({
  ...globalCompany,
  manually_verified_subsidiaries: [
    {
      id: faker.string.uuid(),
      name: faker.company.name(),
      employee_range: faker.helpers.arrayElement(EMPLOYEE_RANGE),
      headquarter_type: faker.helpers.arrayElement(HEADQUARTER_TYPE),
      address: addressFaker(),
      uk_region: ukRegionFaker(),
      archived: false,
    },
  ],
})

export { companyTreeFaker, companyTreeItemFaker, companyTreeItemListFaker }
