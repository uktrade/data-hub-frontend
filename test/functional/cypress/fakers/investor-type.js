import { faker } from '../../../sandbox/utils.mjs'

const investorTypes = [
  'Angel syndicate',
  'Asset manager',
  'Bank',
  'Corporate investor',
  'Corporate venture capital',
  'Family office',
  'Foundations and endowments',
  'Fund of funds',
  'Government agency',
  'Insurance company',
  'Private pension fund',
  'Sovereign wealth fund',
  'State Pension Fund',
  'Venture capital fund / manager',
]

const investorTypeFaker = () => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(investorTypes),
})

const investorTypesListFaker = () =>
  investorTypes.map((name) => {
    return {
      id: faker.string.uuid(),
      name,
    }
  })

export { investorTypesListFaker, investorTypeFaker }

export default investorTypesListFaker
