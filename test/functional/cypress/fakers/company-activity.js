import { faker } from '@faker-js/faker'
import jsf from 'json-schema-faker'

import apiSchema from '../../../api-schema.json'
import { relativeDateFaker } from './dates'
import { listFaker, listFakerAdditionalOverrides } from './utils'
import { userFaker } from './users'
import teamFaker from './team'

const companyActivityFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.Company),
  id: faker.string.uuid(),
  date: relativeDateFaker({ minDays: -100, maxDays: 365 }),
  company: {
    name: faker.word.adjective(),
    id: faker.string.uuid(),
    trading_name: faker.word.adjective(),
  },
  referral: null,
  interaction: null,
  investment: null,
  order: null,
  ...overrides,
})

const companyActivityInteractionFaker = (overrides = {}) => ({
  ...companyActivityFaker(),
  activity_source: 'interaction',
  interaction: {
    contacts: [userFaker()],
    dit_participants: [
      {
        adviser: userFaker(),
        team: teamFaker(),
      },
    ],
    kind: faker.word.adjective(),
    subject: faker.word.words(),
    service: {
      name: faker.lorem.words(),
      id: faker.string.uuid(),
    },
    communication_channel: {
      id: faker.string.uuid(),
      name: 'email/website',
    },
  },
  ...overrides,
})

const companyActivityInvestmentFaker = (
  overrides = {},
  investmentOverrides = {}
) => {
  return {
    ...companyActivityFaker(),
    activity_source: 'investment',
    investment: {
      investment_type: {
        name: faker.company.name(),
        id: faker.string.uuid(),
      },
      estimated_land_date: relativeDateFaker({ minDays: -100, maxDays: 365 }),
      total_investment: faker.number.int(),
      name: faker.word.words(),
      client_contacts: [userFaker({ job_title: faker.person.jobTitle() })],
      id: faker.string.uuid(),
      number_new_jobs: faker.number.int({ min: 0, max: 50 }),
      created_by: userFaker(),
      foreign_equity_investment: faker.number.int({ min: 50, max: 1000 }),
      gross_value_added: faker.number.int({ min: 100, max: 2000 }),
      ...investmentOverrides,
    },
    ...overrides,
  }
}

const companyActivityOrderFaker = (overrides = {}, orderOverrides = {}) => ({
  ...companyActivityFaker(),
  activity_source: 'order',
  order: {
    primary_market: { name: faker.location.country(), id: faker.string.uuid() },
    uk_region: { id: faker.string.uuid(), name: faker.location.county() },
    created_by: userFaker(),
    contact: userFaker({ job_title: faker.person.jobTitle() }),
    reference: faker.company.buzzPhrase(),
    ...orderOverrides,
  },
  ...overrides,
})

const companyActivityGreatFaker = (overrides = {}, orderOverrides = {}) => ({
  ...companyActivityFaker(),
  activity_source: 'great',
  great: {
    id: faker.string.uuid(),
    created_on: relativeDateFaker({ minDays: -100, maxDays: 365 }),
    meta_full_name: faker.person.fullName(),
    meta_email_address: faker.internet.email(),
    contact: userFaker({ job_title: faker.person.jobTitle() }),
    meta_subject: faker.company.buzzPhrase(),
    data_enquiry: faker.lorem.paragraph(),
    ...orderOverrides,
  },
  ...overrides,
})

const companyActivityInteractionListFaker = (length = 1, overrides) =>
  listFaker({
    fakerFunction: companyActivityInteractionFaker,
    length,
    overrides,
  })

const companyActivityOrderListFaker = (
  length = 1,
  overrides,
  orderOverrides
) => {
  return listFakerAdditionalOverrides({
    fakerFunction: companyActivityOrderFaker,
    length,
    overrides,
    additionalOverrides: orderOverrides,
  })
}

const companyActivityGreatListFaker = (
  length = 1,
  overrides,
  orderOverrides
) => {
  return listFakerAdditionalOverrides({
    fakerFunction: companyActivityGreatFaker,
    length,
    overrides,
    additionalOverrides: orderOverrides,
  })
}

const companyActivityInvestmentListFaker = (
  length = 1,
  overrides,
  investmentOverrides
) => {
  return listFakerAdditionalOverrides({
    fakerFunction: companyActivityInvestmentFaker,
    length,
    overrides,
    additionalOverrides: investmentOverrides,
  })
}

export {
  companyActivityInteractionFaker,
  companyActivityInvestmentFaker,
  companyActivityInteractionListFaker,
  companyActivityInvestmentListFaker,
  companyActivityOrderListFaker,
  companyActivityGreatListFaker,
}

export default companyActivityInteractionListFaker
