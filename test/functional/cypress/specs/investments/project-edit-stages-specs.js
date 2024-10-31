const urls = require('../../../../../src/lib/urls')
const {
  investmentProjectEmptyFaker,
} = require('../../fakers/investment-projects')
const { INVESTMENT_PROJECT_STAGES } = require('../../fakers/constants')

export const FIELDS = {
  // Update investment project summary
  NAME: {
    name: 'name',
    message: 'Enter a project name',
  },
  DESCRIPTION: {
    name: 'description',
    message: 'Enter a project description',
  },
  SECTOR: {
    name: 'sector',
    message: 'Choose a primary sector',
  },
  BUSINESS_ACTIVITIES: {
    name: 'business_activities',
    message: 'Choose a business activity',
  },
  CLIENT_CONTACTS: {
    name: 'client_contacts',
    message: 'Choose a client contact',
  },
  REFERRAL_SOURCE_ADVISER: {
    name: 'referral_source_adviser',
    message: "Select yes if you're the referral source for this project",
  },
  IS_REFERRAL_SOURCE: {
    name: 'is_referral_source',
    message: "Select yes if you're the referral source for this project",
  },
  ESTIMATED_LAND_DATE: {
    name: 'estimated_land_date',
    message: 'Enter an estimated land date',
  },
  REFERRAL_SOURCE_ACTIVITY: {
    name: 'referral_source_activity',
    message: 'Choose a referral source activity',
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

  // Edit requirements and location
  STRATEGIC_DRIVERS: {
    name: 'strategic_drivers',
    message: 'Select a strategic driver',
  },
  CLIENT_REQUIREMENTS: {
    name: 'client_requirements',
    message: 'Enter client requirements',
  },
  SITE_DECIDED: { name: 'site_decided', message: 'Select a UK region' },
  DELIVERY_PARTNERS: {
    name: 'delivery_partners',
    message: 'Select a delivery partner',
  },
  UK_REGION_LOCATIONS: {
    name: 'uk_region_locations',
    message: 'Select a possible UK location',
  },

  ADDRESS1: { name: 'address1', message: 'Enter an address' },
  CITY: { name: 'city', message: 'Enter a town or city' },
  POSTCODE: { name: 'postcode', message: 'Enter a postcode' },
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
          FIELDS.NAME,
          FIELDS.DESCRIPTION,
          // FIELDS.SECTOR, // Cypress doesn't pick up null value.
          // FIELDS.REFERRAL_SOURCE_ACTIVITY,
          FIELDS.BUSINESS_ACTIVITIES,
          FIELDS.CLIENT_CONTACTS,
          FIELDS.IS_REFERRAL_SOURCE,
          FIELDS.ESTIMATED_LAND_DATE,

          // FIELDS.REFERRAL_SOURCE_ADVISER, // required when IS_REFERRAL_SOURCE = No
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
          // investment_type can't be null, but should always be set at this stage.
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
          FIELDS.INVESTOR_TYPE,
          FIELDS.LEVEL_OF_INVOLVEMENT,
          FIELDS.SPECIFIC_PROGRAMMES,
          FIELDS.REFERRAL_SOURCE_ACTIVITY,
          FIELDS.LIKELIHOOD_TO_LAND, // Required in API at active stage
          FIELDS.ACTUAL_LAND_DATE,
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

  describe('Edit requirements and location', () => {
    const stageRequiredFields = [
      [INVESTMENT_PROJECT_STAGES.prospect, [], false],
      [
        INVESTMENT_PROJECT_STAGES.assignPm,
        [
          FIELDS.STRATEGIC_DRIVERS,
          FIELDS.CLIENT_REQUIREMENTS,
          FIELDS.UK_REGION_LOCATIONS,
        ],
        false,
      ],
      [
        INVESTMENT_PROJECT_STAGES.active,
        [
          FIELDS.STRATEGIC_DRIVERS,
          FIELDS.CLIENT_REQUIREMENTS,
          {
            name: 'site_decided',
            message: 'Select a value for UK location decision',
          },
          FIELDS.UK_REGION_LOCATIONS,
        ],
        false,
      ],
      [
        INVESTMENT_PROJECT_STAGES.verifyWin,
        [
          FIELDS.STRATEGIC_DRIVERS,
          FIELDS.CLIENT_REQUIREMENTS,
          { name: 'site_decided', message: 'A UK region is required' },
          FIELDS.DELIVERY_PARTNERS,
          FIELDS.UK_REGION_LOCATIONS,
        ],
        true,
      ],
      [
        INVESTMENT_PROJECT_STAGES.won,
        [
          FIELDS.STRATEGIC_DRIVERS,
          FIELDS.CLIENT_REQUIREMENTS,
          { name: 'site_decided', message: 'A UK region is required' },
          FIELDS.DELIVERY_PARTNERS,
        ],
        true,
      ],
    ]
    stageRequiredFields.forEach((stageRequiredField) => {
      const [stage, requiredFields, ukLocationRequired] = stageRequiredField

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
          cy.visit(
            urls.investments.projects.editRequirements(projectEmptyFields.id)
          )
          cy.wait('@apiCall')
        })

        it(`submitting an empty form should show validation errors`, () => {
          cy.get('[data-test="submit-button"]').click()

          assertValidationMessages(requiredFields)
          // Ensure only the expected errors are shown.
          cy.get('[data-test="summary-form-errors"] li').should(
            'have.length',
            requiredFields.length
          )
        })

        if (ukLocationRequired) {
          it('submitting an empty form with site_decide set to Yes should show address validation errors', () => {
            cy.get('[data-test="site-decided-yes"]').click()
            cy.get('[data-test="submit-button"]').click()

            assertValidationMessages([
              FIELDS.SITE_DECIDED,
              FIELDS.ADDRESS1,
              FIELDS.CITY,
              FIELDS.POSTCODE,
            ])
          })
        }
      })
    })
  })
})
