import { INVESTMENT_PROJECT_FORM_VALIDATION } from './constants'

const urls = require('../../../../../src/lib/urls')
const {
  investmentProjectEmptyFaker,
} = require('../../fakers/investment-projects')
const { INVESTMENT_PROJECT_STAGES } = require('../../fakers/constants')

export const FIELDS = {
  // Update investment project summary
  NAME: {
    name: 'name',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PROJECT_NAME,
  },
  DESCRIPTION: {
    name: 'description',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PROJECT_DESCRIPTION,
  },
  SECTOR: {
    name: 'sector',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.PRIMARY_SECTOR,
  },
  BUSINESS_ACTIVITIES: {
    name: 'business_activities',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.BUSINESS_ACTIVITY,
  },
  CLIENT_CONTACTS: {
    name: 'client_contacts',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.CLIENT_CONTACT,
  },
  IS_REFERRAL_SOURCE: {
    name: 'is_referral_source',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.IS_REFERRAL_SOURCE,
  },
  ESTIMATED_LAND_DATE: {
    name: 'estimated_land_date',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.ESTIMATED_LANDDATE,
  },
  REFERRAL_SOURCE_ACTIVITY: {
    name: 'referral_source_activity',
    message: INVESTMENT_PROJECT_FORM_VALIDATION.REFERRAL_SOURCE_ACTIVITY,
  },
  INVESTOR_TYPE: {
    name: 'investor_type',
    message: 'Select an investor type',
  },
  LEVEL_OF_INVOLVEMENT: {
    name: 'level_of_involvement',
    message: 'Select a level of involvement',
  },
  SPECIFIC_PROGRAMMES: {
    name: 'specific_programmes',
    message: 'Select a specific programme',
  },
  LIKELIHOOD_TO_LAND: {
    name: 'likelihood_to_land',
    message: 'Select a likelihood of landing value',
  },
  ACTUAL_LAND_DATE: {
    name: 'actual_land_date',
    message: 'Enter an actual land date',
  },
}

function assertValidationMessage(elementName, message) {
  cy.get('[id="form-errors"]').contains(message)
  cy.get(`[id="field-${elementName}"]`).contains(message)
}

function assertValidationMessages(fields) {
  fields.forEach((field) => {
    assertValidationMessage(field.name, field.message)
  })
}

describe('Field validation for each stage', () => {
  describe('Update investment project summary', () => {
    const stageRequiredFields = [
      [
        INVESTMENT_PROJECT_STAGES.prospect,
        [
          // Sector and investment_type can't be null, but should always be set at this stage.
          // Cypress doesn't pick up null value for the above.
          FIELDS.NAME,
          FIELDS.DESCRIPTION,

          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
        ],
      ],
      [
        INVESTMENT_PROJECT_STAGES.assignPm,
        [
          FIELDS.NAME,
          FIELDS.DESCRIPTION,
          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
        ],
      ],
      [
        INVESTMENT_PROJECT_STAGES.active,
        [
          FIELDS.NAME,
          FIELDS.DESCRIPTION,
          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
          FIELDS.LIKELIHOOD_TO_LAND, // Required in API at active stage
        ],
      ],
      [
        INVESTMENT_PROJECT_STAGES.verifyWin,
        [
          FIELDS.NAME,
          FIELDS.DESCRIPTION,
          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,
          FIELDS.INVESTOR_TYPE,
          FIELDS.LEVEL_OF_INVOLVEMENT,
          FIELDS.SPECIFIC_PROGRAMMES,
          FIELDS.LIKELIHOOD_TO_LAND,
          FIELDS.ACTUAL_LAND_DATE,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
        ],
      ],
      [
        INVESTMENT_PROJECT_STAGES.won,
        [
          FIELDS.NAME,
          FIELDS.DESCRIPTION,
          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,
          FIELDS.INVESTOR_TYPE,
          FIELDS.LEVEL_OF_INVOLVEMENT,
          FIELDS.SPECIFIC_PROGRAMMES,
          FIELDS.LIKELIHOOD_TO_LAND,
          FIELDS.ACTUAL_LAND_DATE,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
        ],
      ],
    ]
    stageRequiredFields.forEach((stageRequiredField) => {
      const [stage, requiredFields] = stageRequiredField

      context(`In the ${stage.name} stage `, () => {
        beforeEach(() => {
          const projectEmptyFields = investmentProjectEmptyFaker({
            stage: stage,
          })
          cy.intercept(
            'GET',
            `/api-proxy/v3/investment/${projectEmptyFields.id}`,
            projectEmptyFields
          ).as('apiCall')
          cy.visit(urls.investments.projects.editDetails(projectEmptyFields.id))
          cy.wait('@apiCall')
        })

        it(`submitting an empty form should show validation errors`, () => {
          cy.get('[data-test="submit"]').click()

          assertValidationMessages(requiredFields)
          // Ensure only the expected errors are shown.
          cy.get('[data-test="summary-form-errors"] li').should(
            'have.length',
            requiredFields.length
          )
        })
      })
    })
  })
})
