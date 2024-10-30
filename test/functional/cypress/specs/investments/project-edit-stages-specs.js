const urls = require('../../../../../src/lib/urls')
const {
  investmentProjectEmptyFaker,
} = require('../../fakers/investment-projects')
const { INVESTMENT_PROJECT_STAGES } = require('../../fakers/constants')

export const FIELDS = {
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

describe('Field validation stages project edit requirements', () => {
  const stageRequiredFields = [
    [INVESTMENT_PROJECT_STAGES.prospect, [FIELDS.CLIENT_REQUIREMENTS], false],
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
