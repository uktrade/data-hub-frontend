import {
  FDI_TYPES,
  INVESTOR_TYPES,
} from '../../../../../src/client/modules/Investments/Projects/constants'
import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'
import { investmentProjectFaker } from '../../fakers/investment-projects'
import { clickButton } from '../../support/actions'

const urls = require('../../../../../src/lib/urls')

const {
  assertFieldTypeahead,
  assertFieldTextarea,
  assertFieldRadiosWithLegend,
  assertFieldInput,
  assertFieldSelect,
  assertFieldDate,
  assertFieldDateShort,
  assertFieldRadios,
  assertErrorSummary,
  assertFieldTypeaheadWithExactText,
} = require('../../support/assertions')

const setupProjectFaker = (overrides) =>
  investmentProjectFaker({
    name: 'New hotel (commitment to invest)',
    description: 'This is a dummy investment project for testing',
    investment_type: {
      name: 'Commitment to invest',
      id: '031269ab-b7ec-40e9-8a4e-7371404f0622',
    },
    anonymous_description: '',
    client_contacts: [
      {
        name: 'Dean Cox',
        id: '952232d2-1d25-4c3a-bcac-2f3a30a94da9',
      },
    ],
    referral_source_adviser: {
      name: 'Puck Head',
      first_name: 'Puck',
      last_name: 'Head',
      id: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
    },
    referral_source_activity: {
      name: 'None',
      id: 'aba8f653-264f-48d8-950e-07f9c418c7b0',
    },
    estimated_land_date: '2020-01-01',
    actual_land_date: null,
    number_new_jobs: null,
    number_safeguarded_jobs: null,
    average_salary: null,
    stage: INVESTMENT_PROJECT_STAGES.prospect,
    ...overrides,
  })
const setup = (project) => {
  cy.intercept('GET', `/api-proxy/v3/investment/${project.id}`, {
    statusCode: 200,
    body: project,
  }).as('getProjectDetails')
  cy.visit(urls.investments.projects.editDetails(project.id))
  cy.wait('@getProjectDetails')
}

describe('Editing the project summary', () => {
  context('when an investment project is at the prospect stage', () => {
    beforeEach(() => {
      setup(setupProjectFaker())
    })

    it('should display the Project name field', () => {
      cy.get('[data-test="field-name"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
          value: 'New hotel (commitment to invest)',
          placeholder: 'e.g. Project Zeus',
        })
      })
    })

    it('should display the Project description field', () => {
      cy.get('[data-test="field-description"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Project description',
          value: 'This is a dummy investment project for testing',
        })
      })
    })

    it('should display the Anonymous project details field', () => {
      cy.get('[data-test="field-anonymous_description"]').then((element) => {
        assertFieldTextarea({
          element,
          label: 'Anonymous project details (optional)',
          hint: 'Do not include company names, financial details or addresses',
        })
      })
    })

    it('should display the Investment Type field', () => {
      cy.get('[data-test="field-investment_type"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Investment type',
          optionsCount: 3,
          value: 'Commitment to invest',
        })
      })
      cy.get('[data-test="field-fdi_type"]').should('not.exist')
    })

    it('should display the FDI type field if FDI is selected', () => {
      cy.get('[data-test="investment-type-fdi"]').click()
      cy.get('[data-test="field-fdi_type"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Type of Foreign Direct Investment (FDI)',
          placeholder: 'Select an FDI type',
        })
      })
    })

    it('should display the Primary sector field', () => {
      cy.get('[data-test="field-sector"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Primary sector',
          placeholder: 'Choose a sector',
        })
      })
    })

    it('should display the Business activities field', () => {
      cy.get('[data-test="field-business_activities"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Business activities',
          placeholder: 'Choose a business activity',
        })
      })
    })

    it('should display the Other business activity field', () => {
      cy.get('[data-test="field-other_business_activity"]').then((element) => {
        assertFieldInput({
          element,
          label: 'Other business activity (if not on list)',
          placeholder: 'e.g. meet and greet dinner',
        })
      })
    })

    it('should display the Client contact details field', () => {
      cy.get('[data-test="field-client_contacts"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Client contact details',
          placeholder: 'Choose a client contact',
          value: 'Dean Cox',
        })
      })
    })

    it('should only display the referral source adviser typeahead if No is chosen', () => {
      cy.get('[data-test="field-referral_source_adviser"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Referral source adviser',
          placeholder: 'Choose a referral source adviser',
          value: 'Puck Head',
          isMulti: false,
        })
      })
    })

    it('should display the Referral source field', () => {
      cy.get('[data-test="field-is_referral_source"]').contains('Yes').click()
      cy.get('[data-test="field-is_referral_source"]').then((element) => {
        assertFieldRadiosWithLegend({
          element,
          legend: 'Are you the referral source for this project?',
          optionsCount: 2,
        })
        cy.get('[data-test="field-referral_source_adviser"]').should(
          'not.exist'
        )
      })
    })

    it('should display the Referral source activity field with no subfields', () => {
      cy.get('[data-test="field-referral_source_activity"]').then((element) => {
        assertFieldSelect({
          element,
          label: 'Referral source activity',
          placeholder: 'Choose a referral source activity',
          value: 'None',
          optionsCount: 53,
        })
      })
      cy.get('[data-test="field-referral_source_activity_event"]').should(
        'not.exist'
      )
      cy.get('[data-test="field-referral_source_activity_marketing"]').should(
        'not.exist'
      )
      cy.get('[data-test="field-referral_source_activity_website"]').should(
        'not.exist'
      )
    })
    it('should display the marketing dropdown when Marketing is selected', () => {
      cy.get('#referral_source_activity').select('Marketing')
      cy.get('[data-test="field-referral_source_activity_marketing"]').then(
        (element) => {
          assertFieldSelect({
            element,
            label: 'Marketing',
            placeholder: 'Please select',
            optionsCount: 8,
          })
        }
      )
      cy.get('[data-test="field-referral_source_activity_event"]').should(
        'not.exist'
      )
      cy.get('[data-test="field-referral_source_activity_website"]').should(
        'not.exist'
      )
    })

    it('should display the website dropdown when Website is selected', () => {
      cy.get('#referral_source_activity').select('Website')
      cy.get('[data-test="field-referral_source_activity_website"]').then(
        (element) => {
          assertFieldSelect({
            element,
            label: 'Website',
            placeholder: 'Please select',
            optionsCount: 6,
          })
        }
      )
      cy.get('[data-test="field-referral_source_activity_event"]').should(
        'not.exist'
      )
      cy.get('[data-test="field-referral_source_activity_marketing"]').should(
        'not.exist'
      )
    })

    it('should display the event input when Event is selected', () => {
      cy.get('#referral_source_activity').select('Event')
      cy.get('[data-test="field-referral_source_activity_event"]').then(
        (element) => {
          assertFieldInput({
            element,
            label: 'Event',
            placeholder: 'e.g. conversation at conference',
          })
        }
      )
      cy.get('[data-test="field-referral_source_activity_website"]').should(
        'not.exist'
      )
      cy.get('[data-test="field-referral_source_activity_marketing"]').should(
        'not.exist'
      )
    })

    it('should display the Estimated land date field', () => {
      cy.get('[data-test="field-estimated_land_date"]').then((element) => {
        assertFieldDateShort({
          element,
          label: 'Estimated land date',
          value: { day: '', month: '01', year: '2020' },
          hint: 'When activities planned under the investment project will have fully commenced',
        })
      })
    })

    it('should display the likelihood of landing field', () => {
      cy.get('[data-test="field-likelihood_to_land"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Likelihood of landing',
          placeholder: 'Select a likelihood of landing value',
        })
      })
    })

    it('should display the Actual land date field', () => {
      cy.get('[data-test="field-actual_land_date"]').then((element) => {
        assertFieldDate({
          element,
          label: 'Actual land date',
          hint: 'When activities under the investment project fully commenced',
        })
      })
    })

    it('should display the new or existing investor field with (optional) text', () => {
      cy.get('[data-test="field-investor_type"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'New or existing investor (optional)',
          optionsCount: 2,
        })
      })
    })

    it('should display the level of investor involvement field', () => {
      cy.get('[data-test="field-level_of_involvement"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Level of investor involvement',
          placeholder: 'Choose a level of involvement',
        })
      })
    })

    it('should display the specific investment programme field with optional text in the label', () => {
      cy.get('[data-test="field-specific_programme"]').then((element) => {
        assertFieldTypeaheadWithExactText({
          element,
          label: 'Specific investment programme (optional)',
          placeholder: 'Choose a specific programme',
        })
      })
    })

    it('should display the form submit and back buttons', () => {
      cy.get('[data-test="submit"]').should('be.visible')
      cy.get('[data-test="cancel-link"]').should('be.visible')
    })

    it('should not allow a future actual land date to be entered', () => {
      cy.get('[data-test="actual_land_date-day"]').type('04')
      cy.get('[data-test="actual_land_date-month"]').type('02')
      cy.get('[data-test="actual_land_date-year"]').type('2350')
      clickButton('Submit')
      assertErrorSummary(['Actual land date cannot be in the future'])
    })
  })

  context('when an investment project is at the active stage', () => {
    beforeEach(() => {
      setup(
        setupProjectFaker({
          stage: INVESTMENT_PROJECT_STAGES.active,
        })
      )
    })

    it('should display the investor type field label without the (optional) text', () => {
      cy.get('[data-test="field-investor_type"]').then((element) => {
        assertFieldRadios({
          element,
          label: 'New or existing investor',
          optionsCount: 2,
        })
      })
    })

    it('should render the specific programme field label without the word optional', () => {
      cy.get('[data-test="field-specific_programme"]').then((element) => {
        assertFieldTypeaheadWithExactText({
          element,
          label: 'Specific investment programme',
          placeholder: 'Choose a specific programme',
        })
      })
    })
  })

  context('When changing the project FDI type to Capital only', () => {
    const project = setupProjectFaker()
    beforeEach(() => {
      setup(project)
      cy.intercept('PATCH', `/api-proxy/v3/investment/*`).as(
        'editDetailsRequest'
      )
      cy.get('[data-test="submit"]').should('exist')
      cy.get('[data-test="investment-type-fdi"]').click()
      cy.get('[data-test="field-fdi_type"]').selectTypeaheadOption(
        FDI_TYPES.capitalOnly.label
      )
      cy.get('[data-test="continue"]').should('exist')
      clickButton('Continue')
    })

    it('should take the user to a confirmation step and display the warning', () => {
      cy.get('form')
        .should('exist')
        .within(() => {
          cy.get('[data-test="field-fdi_type"]').should('not.exist')
          cy.get('[data-test="warning-title"]').should('exist')
          cy.contains(
            `Changing the FDI type to '${FDI_TYPES.capitalOnly.label}' will overwrite the values in the following fields`
          )
          cy.get('[data-test="warning-fields-to-change"]')
            .should('exist')
            .within(() => {
              cy.get('[data-test="item-number-new-jobs"]')
                .should('exist')
                .contains(
                  `currently: ${project.number_new_jobs}, will change to: 0`
                )
              cy.get('[data-test="item-average-salary"]')
                .should('exist')
                .contains(
                  `currently: ${project.average_salary}, will change to: null`
                )
              cy.get('[data-test="item-number-safeguarded-jobs"]')
                .should('exist')
                .contains(
                  `currently: ${project.number_safeguarded_jobs}, will change to: 0`
                )
            })
          cy.contains('Are you sure you want to proceed?')
          cy.get('[data-test="submit"]').should('exist')
        })
    })

    it('should submit the request with zero new and safeguarded jobs, and null for average salary', () => {
      clickButton('Submit')
      cy.wait('@editDetailsRequest').its('request.body').should('include', {
        number_new_jobs: 0,
        average_salary: null,
        number_safeguarded_jobs: 0,
      })
    })
  })

  context(
    'When changing the project FDI type to anything other than Capital only',
    () => {
      beforeEach(() => {
        setup(setupProjectFaker())
        cy.intercept('PATCH', `/api-proxy/v3/investment/*`).as(
          'editDetailsRequest'
        )
        cy.get('[data-test="submit"]').should('exist')
        cy.get('[data-test="investment-type-fdi"]').click()
        cy.get('[data-test="field-fdi_type"]').selectTypeaheadOption(
          'Creation of new site or activity'
        )
      })

      it('should not take the user to a confirmation step', () => {
        cy.get('[data-test="continue"]').should('not.exist')
        cy.get('[data-test="submit"]').should('exist')
        clickButton('Submit')
      })

      it('should not append job fields to the request payload', () => {
        clickButton('Submit')
        cy.wait('@editDetailsRequest')
          .its('request.body')
          .should('not.include', {
            number_new_jobs: 0,
            average_salary: null,
            number_safeguarded_jobs: 0,
          })
      })
    }
  )

  context('When changing the project FDI type from other to Expansion', () => {
    beforeEach(() => {
      const project = setupProjectFaker({
        investor_type: {
          name: INVESTOR_TYPES.new.label,
          id: INVESTOR_TYPES.new.value,
        },
      })
      setup(project)
      cy.intercept('PATCH', `/api-proxy/v3/investment/*`).as(
        'editDetailsRequest'
      )
      cy.get('[data-test="field-investor_type"]').should('exist')
      cy.get('[data-test="investor-type-new-investor"]').should('be.checked')
      cy.get('[data-test="investment-type-fdi"]').click()
      cy.get('[data-test="field-fdi_type"]').selectTypeaheadOption(
        FDI_TYPES.expansionOfExistingSiteOrActivity.label
      )
    })

    it('should hide the investor type field', () => {
      cy.get('[data-test="field-investor_type"]').should('not.exist')
    })

    it('should not take the user to a confirmation step', () => {
      cy.get('[data-test="continue"]').should('not.exist')
      cy.get('[data-test="submit"]').should('exist')
      clickButton('Submit')
    })

    it('should submit the request with investor type set to existing', () => {
      clickButton('Submit')
      cy.wait('@editDetailsRequest')
        .its('request.body')
        .should('deep.include', {
          investor_type: INVESTOR_TYPES.existing.value,
        })
    })
  })

  context('When changing the project FDI type from Expansion to other', () => {
    beforeEach(() => {
      const project = setupProjectFaker({
        fdi_type: {
          name: FDI_TYPES.expansionOfExistingSiteOrActivity.label,
          id: FDI_TYPES.expansionOfExistingSiteOrActivity.value,
        },
        investment_type: {
          name: 'FDI',
          id: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
        },
        investor_type: {
          name: INVESTOR_TYPES.existing.label,
          id: INVESTOR_TYPES.existing.value,
        },
      })
      setup(project)
      cy.intercept('PATCH', `/api-proxy/v3/investment/*`).as(
        'editDetailsRequest'
      )
      cy.get('[data-test="field-investor_type"]').should('not.exist')
      cy.get('[data-test="investment-type-fdi"]').click()
      cy.get('[data-test="field-fdi_type"]').selectTypeaheadOption(
        FDI_TYPES.jointVenture.label
      )
    })

    it('should show the investor type field and set the field to null', () => {
      cy.get('[data-test="field-investor_type"]').should('exist')
      cy.get('[data-test="investor-type-existing-investor"]').should(
        'not.be.checked'
      )
      cy.get('[data-test="investor-type-new-investor"]').should(
        'not.be.checked'
      )
    })

    it('should submit the request with investor type set to null if the user has not re-selected', () => {
      clickButton('Submit')
      cy.wait('@editDetailsRequest')
        .its('request.body')
        .should('deep.include', {
          investor_type: null,
        })
    })

    it('should submit the request with investor type set to the user selection', () => {
      cy.get('[data-test="investor-type-new-investor"]').click()
      clickButton('Submit')
      cy.wait('@editDetailsRequest')
        .its('request.body')
        .should('deep.include', {
          investor_type: INVESTOR_TYPES.new.value,
        })
    })
  })
})
