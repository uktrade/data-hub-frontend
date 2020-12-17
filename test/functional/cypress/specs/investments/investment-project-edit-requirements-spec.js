const {
  assertFormFields,
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldAddAnother,
  assertFieldTextarea,
  assertFieldInput,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')

const projectNoExistingRequirements = require('../../fixtures/investment/investment-no-existing-requirements.json')
const projectHasExistingRequirements = require('../../fixtures/investment/investment-has-existing-requirements.json')

const assertBooleanFieldRadios = ({ element, legend, value }) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('legend')
    .first()
    .should('have.text', legend)
    .parent()
    .find('input')
    .should('have.length', 2)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', 'Yes')
    )

const assertRequirementsFieldAddress = ({ element, value = {} }) => {
  const addressElements = [
    {
      assert: ({ element }) => cy.wrap(element).should('have.text', 'Address'),
    },
    {
      label: 'Street',
      value: value.line_1,
      assert: assertFieldInput,
    },
    {
      label: 'Street 2',
      value: value.line_2,
      assert: assertFieldInput,
    },
    {
      label: 'Town',
      value: value.town,
      assert: assertFieldInput,
    },
    {
      label: 'Postcode',
      value: value.postcode,
      assert: assertFieldInput,
    },
  ]
  cy.wrap(element)
    .children()
    .each((item, i) => {
      if (addressElements[i]) {
        const { assert, ...params } = addressElements[i]
        assert({ element: item, ...params })
      }
    })
}

const assertRequirementsForm = ({ project }) => {
  it('should render the header', () => {
    assertLocalHeader(project.name)
  })
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Investments: '/investments',
      Projects: investments.projects.index(),
      [project.name]: null,
    })
  })

  it('should render expected form fields with existing values', () => {
    assertFormFields(cy.get('form'), [
      {
        assert: assertFieldAddAnother,
        label: 'Strategic drivers behind this investment',
        values: project.strategic_drivers,
        optionsCount: 11,
        emptyOption: '-- Select strategic driver --',
      },
      {
        assert: assertFieldTextarea,
        label: 'Client requirements',
        value: project.client_requirements,
      },
      {
        assert: assertBooleanFieldRadios,
        legend: 'Is the client considering other countries?',
        value: project.client_considering_other_countries,
        optionsCount: 2,
      },
      {
        assert: assertFieldAddAnother,
        label: 'Competitor countries',
        emptyOption: '-- Select country --',
        values: project.competitor_countries,
        optionsCount: 251,
      },
      {
        assert: assertFieldAddAnother,
        label: 'Possible UK locations for this investment',
        values: project.uk_region_locations,
        optionsCount: 16,
        emptyOption: '-- Select region --',
      },
      {
        assert: assertBooleanFieldRadios,
        legend:
          'Has the UK location (site address) for this investment been decided yet?',
        value: project.site_decided,
        optionsCount: 2,
      },
      {
        assert: assertRequirementsFieldAddress,
        value: {
          line_1: project.address_1,
          line_2: project.address_2,
          town: project.address_town,
          postcode: project.address_postcode,
        },
      },
      {
        assert: assertFieldAddAnother,
        label: 'UK regions landed',
        values: project.actual_uk_regions,
        optionsCount: 16,
        emptyOption: '-- Select region --',
      },
      {
        assert: assertFieldAddAnother,
        label: 'Delivery partners',
        values: project.delivery_partners,
        optionsCount: 43,
        emptyOption: '-- Select a partner --',
      },
    ])
  })
}

describe('Edit the requirements of a project', () => {
  context('When editing a project without existing requirements data', () => {
    before(() => {
      cy.visit(investments.projects.details(projectNoExistingRequirements.id))
      cy.contains('Add requirements').click()
    })

    assertRequirementsForm({ project: projectNoExistingRequirements })

    it('should not display hidden fields', () => {
      cy.get('[data-cy="group-field-competitor_countries"]').should('be.hidden')

      cy.get('[data-cy="group-field-actual_uk_regions"]').should('be.hidden')
    })
  })

  context(
    'When editing a project with existing requirements data including all expanded fields',
    () => {
      before(() => {
        cy.visit(
          investments.projects.details(projectHasExistingRequirements.id)
        )
        cy.contains('Edit requirements').click()
      })
      assertRequirementsForm({ project: projectHasExistingRequirements })
    }
  )

  context('When making changes to all fields', () => {
    before(() => {
      cy.visit(investments.projects.details(projectNoExistingRequirements.id))
      cy.contains('Add requirements').click()
    })

    it('should allow the user to fill in all fields', () => {
      cy.get('[data-cy="field-strategic_drivers"]').select('Skills seeking')

      cy.get('[data-cy="field-strategic_drivers-add_button"]').click()

      cy.get('[data-cy="field-strategic_drivers-1"]').select('Cost reduction')

      cy.get('[data-cy="field-client_requirements"]').type('Test requirements')

      cy.get('[data-cy="field-client_considering_other_countries-1"]').check({
        // required as the label covers the radio button
        force: true,
      })

      cy.get('[data-cy="field-competitor_countries"]').select('Japan')

      cy.get('[data-cy="field-uk_region_locations"]').select('East Midlands')

      cy.get('[data-cy="field-uk_region_locations-add_button"]').click()

      cy.get('[data-cy="field-uk_region_locations-1"]').select(
        'East of England'
      )

      cy.get('[data-cy="field-site_decided-1"]').check({
        force: true,
      })

      cy.get('[data-cy="field-address_1"]').type('Street address')

      cy.get('[data-cy="field-address_2"]').type('Street address 2')

      cy.get('[data-cy="field-address_town"]').type('Town')

      cy.get('[data-cy="field-address_postcode"]').type('AB1 2CD')

      cy.get('[data-cy="field-actual_uk_regions"]').select('East Midlands')

      cy.get('[data-cy="field-actual_uk_regions-add_button"]').click()

      cy.get('[data-cy="field-actual_uk_regions-1"]').select('East of England')

      cy.get('[data-cy="field-delivery_partners"]').select('Black Country LEP')

      cy.get('[data-cy="field-delivery_partners-add_button"]').click()

      cy.get('[data-cy="field-delivery_partners-1"]').select(
        'Coast to Capital LEP'
      )

      cy.contains('Save').click()
    })

    it('should redirect the user to the details screen', () => {
      cy.url().should(
        'include',
        investments.projects.details(projectNoExistingRequirements.id)
      )
      cy.url().should('not.include', 'edit-requirements')
    })

    it('should display a flash message to inform the user of the change', () => {
      cy.get('[data-cy="flash"]').contains('Investment requirements updated')
    })
  })

  context('When making changes that miss out required fields', () => {
    before(() => {
      cy.visit(investments.projects.details(projectNoExistingRequirements.id))
      cy.contains('Add requirements').click()

      cy.get('[data-cy="field-strategic_drivers"]').select('Skills seeking')

      cy.contains('Save').click()
    })

    it('should not redirect the user to the details screen', () => {
      cy.url().should('include', 'edit-requirements')
    })

    it('should display a flash message to inform the user of the error', () => {
      cy.get('[data-cy="form-alert"]').contains(
        'There was a problem submitting this form'
      )
    })

    it('should highlight erroneous form input', () => {
      cy.get('[data-cy="group-field-client_requirements"]')
        .should('have.class', 'has-error')
        .contains('required')
    })
  })
})
