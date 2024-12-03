import { faker } from '../../../sandbox/utils'

import { listFaker } from './utils'
import { investorTypeFaker } from './investor-type'
import countryListFaker from './countries'
import ukRegionListFaker from './regions'

const largeInvestorProfileFaker = (overrides = {}) => ({
  id: faker.string.uuid(),
  investorCompany: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  createdOn: faker.date.past(),
  modifiedOn: faker.date.past(),
  incompleteDetailsFields: [],
  incompleteRequirementsFields: [],
  incompleteLocationFields: [],
  investorType: investorTypeFaker(),
  investableCapital: faker.number.int(),
  globalAssetsUnderManagement: faker.number.int(),
  investorDescription: faker.word.words(),
  requiredChecksConducted: { id: faker.string.uuid(), name: 'Not yet checked' },
  requiredChecksConductedOn: faker.date.past(),
  requiredChecksConductedBy: null,
  dealTicketSizes: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
  investmentTypes: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
  minimumReturnRate: { id: faker.string.uuid(), name: faker.word.adjective() },
  timeHorizons: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
  constructionRisks: [
    { id: faker.string.uuid(), name: faker.word.adjective() },
  ],
  minimumEquityPercentage: {
    id: faker.string.uuid(),
    name: faker.word.adjective(),
  },
  desiredDealRoles: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
  restrictions: [{ id: faker.string.uuid(), name: faker.word.adjective() }],
  assetClassesOfInterest: [
    { id: faker.string.uuid(), name: faker.word.adjective() },
  ],
  ukRegionLocations: ukRegionListFaker(),
  notesOnLocations: faker.word.words(),
  otherCountriesBeingConsidered: countryListFaker(),
  ...overrides,
})

const largeInvestorProfileListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: largeInvestorProfileFaker, length, overrides })

export { largeInvestorProfileFaker, largeInvestorProfileListFaker }

export default largeInvestorProfileListFaker
