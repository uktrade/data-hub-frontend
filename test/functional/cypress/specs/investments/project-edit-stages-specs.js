import {
  FIELDS,
  EDIT_VALUE_ADDITIONAL_FIELDS,
  EDIT_REQUIREMENTS_ADDITIONAL_FIELDS,
  EDIT_REQUIREMENTS_BASE_FIELDS,
  UPDATE_SUMMARY_ADDITIONAL_FIELDS,
  UPDATE_SUMMARY_BASE_FIELDS,
} from './constants'

const urls = require('../../../../../src/lib/urls')
const {
  investmentProjectEmptyFaker,
} = require('../../fakers/investment-projects')
const { INVESTMENT_PROJECT_STAGES } = require('../../fakers/constants')

function assertValidationMessage(elementName, message) {
  cy.get('[id="form-errors"]').contains(message)
  cy.get(`[id="field-${elementName}"]`).contains(message)
}

function assertValidationMessages(fields) {
  fields.forEach((field) => {
    assertValidationMessage(field.name, field.message)
  })
}

function assertRequiredFieldsForStages(
  stageRequiredFields,
  urlFunction,
  buttonName
) {
  stageRequiredFields.forEach((stageRequiredField) => {
    const [stage, requiredFields, ukLocationRequired = false] =
      stageRequiredField

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
        cy.visit(urlFunction(projectEmptyFields.id))
        cy.wait('@apiCall')
      })

      it(`submitting an empty form should show validation errors`, () => {
        cy.get(`[data-test="${buttonName}"]`).click()

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
}

describe('Field validation for each stage', () => {
  describe('Update investment project summary', () => {
    const stageRequiredFields = [
      [INVESTMENT_PROJECT_STAGES.prospect, UPDATE_SUMMARY_BASE_FIELDS],
      [INVESTMENT_PROJECT_STAGES.assignPm, UPDATE_SUMMARY_BASE_FIELDS],
      [
        INVESTMENT_PROJECT_STAGES.active,
        [...UPDATE_SUMMARY_BASE_FIELDS, FIELDS.LIKELIHOOD_TO_LAND],
      ],
      [
        INVESTMENT_PROJECT_STAGES.verifyWin,
        [...UPDATE_SUMMARY_BASE_FIELDS, ...UPDATE_SUMMARY_ADDITIONAL_FIELDS],
      ],
      [
        INVESTMENT_PROJECT_STAGES.won,
        [...UPDATE_SUMMARY_BASE_FIELDS, ...UPDATE_SUMMARY_ADDITIONAL_FIELDS],
      ],
    ]
    assertRequiredFieldsForStages(
      stageRequiredFields,
      urls.investments.projects.editDetails,
      'submit'
    )
  })
  describe('Edit requirements and location', () => {
    const stageRequiredFields = [
      [INVESTMENT_PROJECT_STAGES.prospect, [], false],
      [
        INVESTMENT_PROJECT_STAGES.assignPm,
        EDIT_REQUIREMENTS_BASE_FIELDS,
        false,
      ],
      [
        INVESTMENT_PROJECT_STAGES.active,
        [
          ...EDIT_REQUIREMENTS_BASE_FIELDS,
          {
            name: 'site_decided',
            message: 'Select a value for UK location decision',
          },
        ],
        false,
      ],
      [
        INVESTMENT_PROJECT_STAGES.verifyWin,
        EDIT_REQUIREMENTS_ADDITIONAL_FIELDS,
        true,
      ],
      [
        INVESTMENT_PROJECT_STAGES.won,
        EDIT_REQUIREMENTS_ADDITIONAL_FIELDS,
        true,
      ],
    ]
    assertRequiredFieldsForStages(
      stageRequiredFields,
      urls.investments.projects.editRequirements,
      'submit-button'
    )
  })

  describe('Edit value', () => {
    const stageRequiredFields = [
      [INVESTMENT_PROJECT_STAGES.prospect, []],
      [
        INVESTMENT_PROJECT_STAGES.assignPm,
        [FIELDS.CLIENT_CANNOT_PROVIDE_TOTAL_INVESTMENT],
      ],
      [
        INVESTMENT_PROJECT_STAGES.active,
        [FIELDS.CLIENT_CANNOT_PROVIDE_TOTAL_INVESTMENT],
      ],
      [INVESTMENT_PROJECT_STAGES.verifyWin, EDIT_VALUE_ADDITIONAL_FIELDS],
      [INVESTMENT_PROJECT_STAGES.won, EDIT_VALUE_ADDITIONAL_FIELDS],
    ]
    assertRequiredFieldsForStages(
      stageRequiredFields,
      urls.investments.projects.editValue,
      'submit-button'
    )
  })
})
