import jsf from 'json-schema-faker'
import faker from 'faker'
import {
  investmentProjectCodeFaker,
  investmentProjectStageFaker,
} from '../fakers'

import apiSchema from '../../../api-schema.json'

const investmentProjectFactory = (overrides) => ({
  ...jsf.generate(apiSchema.components.schemas.IProject),
  id: faker.datatype.uuid(),
  stage: investmentProjectStageFaker(),
  investor_company: {
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
  },
  project_code: investmentProjectCodeFaker(),
  incomplete_fields: [],
  ...overrides,
})

export const investmentProjectsFactory = (overrides, length = 1) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list.push(investmentProjectFactory(overrides))
  }
  return list
}

export default investmentProjectsFactory
