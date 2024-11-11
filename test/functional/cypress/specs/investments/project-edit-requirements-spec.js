const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldTextarea,
  assertFieldRadios,
  assertFieldTypeahead,
  assertFieldInput,
  assertFieldUneditable,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

const projectNoExistingRequirements = require('../../fixtures/investment/investment-no-existing-requirements.json')
const projectHasExistingRequirements = require('../../fixtures/investment/investment-has-existing-requirements.json')
const ukRegions = require('../../../../sandbox/fixtures/metadata/uk-region.json')

const navigateToForm = ({ project }, dataTest = 'edit') => {
  cy.visit(investments.projects.details(project.id))
  cy.get(`[data-test="${dataTest}-requirements-button"]`).click()
}

const checkIfClientConsidering = (valueToCheck) => (valueToCheck ? 3 : 2)
const checkIfSiteDecided = (valueToCheck) => (valueToCheck ? 7 : 2)
const convertBoolToYesNo = (valueToCheck) => (valueToCheck ? 'Yes' : 'No')
const convertBoolToYesNoWithNullCheck = (valueToCheck) =>
  valueToCheck === null ? null : convertBoolToYesNo(valueToCheck)

const testProjectRequirementsForm = ({ project }, dataTest) => {
  beforeEach(() => {
    navigateToForm({ project }, dataTest)
  })

  it('should render the header', () => {
    assertLocalHeader(project.name)
  })
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: investments.index(),
      Projects: investments.projects.index(),
      [project.name]: investments.projects.details(project.id),
      'Edit requirements': null,
    })
  })

  it('should render the strategic drivers field', () => {
    cy.get('[data-test="field-strategic_drivers"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Strategic drivers behind this investment',
        placeholder: 'Select a strategic driver',
        values: project.strategic_drivers,
      })
    })
  })

  it('should display the client requirements field', () => {
    cy.get('[data-test="field-client_requirements"]').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Client requirements',
        value: project.client_requirements,
      })
    })
  })

  it('should display the considering other countries field', () => {
    cy.get('[data-test="field-client_considering_other_countries"]').then(
      (element) => {
        assertFieldRadios({
          element,
          label: 'Is the client considering other countries? (required)',
          optionsCount: checkIfClientConsidering(
            project.client_considering_other_countries
          ),
          value: convertBoolToYesNoWithNullCheck(
            project.client_considering_other_countries
          ),
        })
      }
    )
  })

  project.client_considering_other_countries
    ? it('should display the competitor countries field', () => {
        cy.get('[data-test="field-competitor_countries"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Competitor countries',
            placeholder: 'Choose a country',
            values: project.competitor_countries,
          })
        })
      })
    : it('should not display the competitor countries field', () => {
        cy.get('[data-test="field-competitor_countries"]').should('not.exist')
      })

  it('should render the possible UK locations field', () => {
    cy.get('[data-test="field-uk_region_locations"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Possible UK locations for this investment',
        placeholder: 'Select a UK region',
        values: project.uk_region_locations,
      })
    })
  })

  it('should only display active UK regions when the possible UK locations field is selected', () => {
    const activeUkRegions = ukRegions.filter((region) => !region.disabled_on)
    cy.get('[data-test="field-uk_region_locations"]').as('typeaheadField')
    cy.get('@typeaheadField').find('input').first().click()
    cy.get('[data-test="typeahead-menu-option"]').should('be.visible')
    cy.get('[data-test="typeahead-menu-option"]').should(
      'have.length',
      activeUkRegions.length
    )
  })

  it('should display the site decided field', () => {
    cy.get('[data-test="field-site_decided"]').then((element) => {
      assertFieldRadios({
        element,
        label:
          'Has the UK location (site address) for this investment been decided yet?',
        optionsCount: checkIfSiteDecided(project.site_decided),
        value: convertBoolToYesNoWithNullCheck(project.site_decided),
      })
    })
  })

  project.site_decided
    ? it('should display the address field', () => {
        cy.get('[data-test="field-country"]').then((element) => {
          assertFieldUneditable({
            element,
            label: 'Country',
            value: 'United Kingdom',
          })
        })
        cy.get('[data-test="field-address1"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Address line 1',
            value: project.address_1,
          })
        })
        cy.get('[data-test="field-address2"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Address line 2 (optional)',
            value: project.address_2,
          })
        })
        cy.get('[data-test="field-city"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Town or city',
            value: project.address_town,
          })
        })
        cy.get('[data-test="field-postcode"]').then((element) => {
          assertFieldInput({
            element,
            label: 'Postcode',
            value: project.address_postcode,
          })
        })
      })
    : it('should not display the address field', () => {
        cy.get('[data-test="field-address"]').should('not.exist')
      })

  if (project.site_decided) {
    it('should render the landed regions field', () => {
      cy.get('[data-test="field-actual_uk_regions"]').then((element) => {
        assertFieldTypeahead({
          element,
          label: 'UK regions landed',
          placeholder: 'Select a UK region',
          values: project.actual_uk_regions,
        })
      })
    })

    it('should only display active UK regions when the landed regions field is selected', () => {
      const activeUkRegions = ukRegions.filter((region) => !region.disabled_on)
      cy.get('[data-test="field-actual_uk_regions"]').as('typeaheadField')
      cy.get('@typeaheadField').find('input').first().click()
      cy.get('[data-test="typeahead-menu-option"]').should('be.visible')
      cy.get('[data-test="typeahead-menu-option"]').should(
        'have.length',
        activeUkRegions.length
      )
    })
  } else {
    it('should not display the landed regions field', () => {
      cy.get('[data-test="field-actual_uk_regions"]').should('not.exist')
    })
  }

  it('should render the delivery partners field', () => {
    cy.get('[data-test="field-delivery_partners"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Delivery partners',
        placeholder: 'Select a delivery partner',
        values: project.delivery_partners,
      })
    })
  })
}

describe('Edit the requirements of a project', () => {
  context('When editing a project without existing requirements data', () => {
    testProjectRequirementsForm(
      { project: projectNoExistingRequirements },
      'add'
    )
  })

  context(
    'When editing a project with existing requirements data including all expanded fields',
    () => {
      testProjectRequirementsForm({ project: projectHasExistingRequirements })
    }
  )

  context('When making changes to all fields', () => {
    beforeEach(() => {
      navigateToForm({ project: projectNoExistingRequirements }, 'add')
    })

    it('should allow the user to fill in all fields, redirect upon submission, and display a flash message', () => {
      cy.get('[data-test="field-strategic_drivers"]')
        .selectTypeaheadOption('Skills seeking')
        .selectTypeaheadOption('Cost reduction')

      cy.get('[data-test="field-client_requirements"]').type(
        'Test requirements'
      )

      cy.get('[data-test="client-considering-other-countries-yes"]').click()
      cy.get('[data-test="field-competitor_countries"]').selectTypeaheadOption(
        'Japan'
      )

      cy.get('[data-test="field-uk_region_locations"]')
        .selectTypeaheadOption('East Midlands')
        .selectTypeaheadOption('East of England')

      cy.get('[data-test="site-decided-yes"]').click()
      cy.get('[data-test="field-address1"]').type('Street address')
      cy.get('[data-test="field-address2"]').type('Street address 2')
      cy.get('[data-test="field-city"]').type('Town')
      cy.get('[data-test="field-postcode"]').type('AB1 2CD')

      cy.get('[data-test="field-actual_uk_regions"]')
        .selectTypeaheadOption('East Midlands')
        .selectTypeaheadOption('East of England')

      cy.get('[data-test="field-delivery_partners"]')
        .selectTypeaheadOption('Black Country LEP')
        .selectTypeaheadOption('Coast to Capital LEP')

      cy.get('[data-test="submit-button"]').click()

      cy.url().should(
        'include',
        investments.projects.details(projectNoExistingRequirements.id)
      )
      cy.url().should('not.include', 'edit-requirements')

      cy.get('[data-test="flash"]').contains('Investment requirements updated')
    })
  })
})
