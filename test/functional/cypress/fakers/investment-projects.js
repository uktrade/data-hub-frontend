import faker from 'faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'

import { listFaker, randomChoice } from './utils'
import { numberStringFaker } from './numbers'
import { relativeDateFaker } from './dates'

const investmentProjectStages = [
  {
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    name: 'Prospect',
  },
  {
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
    name: 'Assign PM',
  },
  {
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
    name: 'Active',
  },
  {
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
    name: 'Verify Win',
  },
  {
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
    name: 'Won',
  },
]
const investmentProjectStageFaker = () => randomChoice(investmentProjectStages)

const incompleteFieldOptions = [
  'client_cannot_provide_total_investment',
  'number_new_jobs',
  'strategic_drivers',
  'client_requirements',
  'client_considering_other_countries',
  'project_manager',
  'project_assurance_adviser',
  'client_cannot_provide_foreign_investment',
  'government_assistance',
  'number_safeguarded_jobs',
  'r_and_d_budget',
  'non_fdi_r_and_d_budget',
  'new_tech_to_uk',
  'export_revenue',
  'address_1',
  'address_town',
  'address_postcode',
  'actual_uk_regions',
  'delivery_partners',
  'actual_land_date',
  'referral_source_activity_event',
  'other_business_activity',
  'referral_source_activity_marketing',
  'referral_source_activity_website',
  'fdi_type',
  'total_investment',
  'competitor_countries',
  'uk_region_locations',
  'foreign_equity_investment',
  'average_salary',
  'associated_non_fdi_r_and_d_project',
]
const incompleteFieldOptionFaker = () => randomChoice(incompleteFieldOptions)

const investmentProjectCodeFaker = () => `DHP-${numberStringFaker(8)}`

/**
 * Generate fake data for a single investment project.
 *
 * Starts by generating data based on the json schema, adds some defaults and
 * merges in overrides.
 */
const investmentProjectFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.IProject),
  id: faker.datatype.uuid(),
  stage: investmentProjectStageFaker(),
  estimated_land_date: relativeDateFaker({ minDays: -100, maxDays: 365 }),
  investor_company: {
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
  },
  project_code: investmentProjectCodeFaker(),
  incomplete_fields: [],
  ...overrides,
})

/**
 * Generate fake data for a list of investment project.
 *
 * The number of items is determined by the length (default is 1).
 * Overrides are applied to all items in the list (default is {}).
 */
const investmentProjectListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: investmentProjectFaker, length, overrides })

export {
  investmentProjectFaker,
  investmentProjectListFaker,
  investmentProjectCodeFaker,
  investmentProjectStageFaker,
  incompleteFieldOptionFaker,
}

export default investmentProjectListFaker
