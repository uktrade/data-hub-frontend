import { faker } from '../../../sandbox/utils/random'

import { listFaker } from './utils'
import { addressFaker } from './addresses'
import { ukRegionFaker } from './regions'
import { EMPLOYEE_RANGE, HEADQUARTER_TYPE, ONE_LIST_TIER } from './constants'
import {
  formatDate,
  DATE_FORMAT_ISO_WITH_TIME_FULL,
} from '../../../../src/client/utils/date-utils'

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
  latest_interaction_date: formatDate(
    faker.date.past(),
    DATE_FORMAT_ISO_WITH_TIME_FULL
  ),
  one_list_tier: faker.helpers.arrayElement(ONE_LIST_TIER),
  archived: false,
  trading_names: [faker.company.name()],
  headquarter_type: faker.helpers.arrayElement(HEADQUARTER_TYPE),
  hierarchy: 1,
  subsidiaries: [],
  is_out_of_business: false,
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
    employee_range: faker.helpers.arrayElement(EMPLOYEE_RANGE),
    headquarter_type: faker.helpers.arrayElement(HEADQUARTER_TYPE),
    address: addressFaker(),
    uk_region: ukRegionFaker(),
    one_list_tier: faker.helpers.arrayElement(ONE_LIST_TIER),
    archived: false,
    hierarchy: 0,
    trading_names: [faker.company.name()],
  }
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
  mannualVerifiedSubsidiariesCount = 0,
}) => ({
  ...globalCompany,
  manually_verified_subsidiaries: [
    ...new Array(mannualVerifiedSubsidiariesCount),
  ].map(manuallyLinkedCompanyFaker),
})

export { companyTreeFaker, companyTreeItemFaker, companyTreeItemListFaker }
