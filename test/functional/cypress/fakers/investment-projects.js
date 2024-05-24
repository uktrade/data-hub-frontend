import { faker } from '@faker-js/faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'

import {
  INVESTMENT_PROJECT_STAGES_LIST,
  INVESTMENT_PROJECT_STATUSES_LIST,
} from './constants'
import { relativeDateFaker } from './dates'
import { numberStringFaker } from './numbers'
import { listFaker, randomChoice } from './utils'
import { sectorFaker } from './sectors'

const investmentProjectStageFaker = () =>
  randomChoice(INVESTMENT_PROJECT_STAGES_LIST)

const investmentProjectStatusFaker = () =>
  randomChoice(INVESTMENT_PROJECT_STATUSES_LIST)

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
  id: faker.string.uuid(),
  stage: investmentProjectStageFaker(),
  estimated_land_date: relativeDateFaker({ minDays: -100, maxDays: 365 }),
  investor_company: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  sector: sectorFaker(),
  status: investmentProjectStatusFaker(),
  project_code: investmentProjectCodeFaker(),
  incomplete_fields: [],
  investment_type: {
    name: faker.company.name(),
    id: faker.string.uuid(),
  },
  gva_multiplier: {
    sector_classification_gva_multiplier: 'labour',
    id: faker.string.uuid(),
  },
  ...overrides,
})

/**
 * Generate fake data for a list of investment projects.
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
