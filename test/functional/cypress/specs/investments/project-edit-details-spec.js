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
} = require('../../support/assertions')

const project = require('../../fixtures/investment/investment-no-existing-requirements.json')

describe('Editing the project summary', () => {
  beforeEach(() => {
    cy.visit(urls.investments.projects.editDetails(project.id))
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
        label: 'Type of foreign direct investment (FDI)',
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
      cy.get('[data-test="field-referral_source_adviser"]').should('not.exist')
    })
  })

  it('should display the Referral source activity field with no subfields', () => {
    cy.get('[data-test="field-referral_source_activity"]').then((element) => {
      assertFieldSelect({
        element,
        label: 'Referral source activity',
        placeholder: 'Choose a referral source activity',
        value: 'None',
        optionsCount: 46,
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

  it('should display the new or existing investor field', () => {
    cy.get('[data-test="field-investor_type"]').then((element) => {
      assertFieldRadios({
        element,
        label: 'New or existing investor',
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

  it('should display the specific investment programme field', () => {
    cy.get('[data-test="field-specific_programme"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Specific investment programme',
        placeholder: 'Choose a specific programme',
      })
    })
  })

  it('should display the form submit and back buttons', () => {
    cy.get('[data-test="submit-button"]').should('be.visible')
    cy.get('[data-test="cancel-button"]').should('be.visible')
  })

  it('should not allow a future actual land date to be entered', () => {
    cy.get('[data-test="actual_land_date-day"]').type('04')
    cy.get('[data-test="actual_land_date-month"]').type('02')
    cy.get('[data-test="actual_land_date-year"]').type('2350')
    cy.get('[data-test="submit-button"]').click()
    assertErrorSummary(['Actual land date cannot be in the future'])
  })
})
