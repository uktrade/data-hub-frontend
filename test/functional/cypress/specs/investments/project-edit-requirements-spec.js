import { INVESTMENT_PROJECT_STAGES } from '../../fakers/constants'

const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertErrorSummary,
  assertFieldTextarea,
  assertFieldRadios,
  assertFieldRadiosNotSelected,
  assertFieldRadioSelected,
  assertFieldTypeahead,
  assertFieldInput,
  assertFieldUneditable,
} = require('../../support/assertions')
const { investments } = require('../../../../../src/lib/urls')
const { investmentProjectFaker } = require('../../fakers/investment-projects')
const projectNoExistingRequirements = require('../../fixtures/investment/investment-no-existing-requirements.json')
const projectHasExistingRequirements = require('../../fixtures/investment/investment-has-existing-requirements.json')
const ukRegions = require('../../../../sandbox/fixtures/metadata/uk-region.json')

const ukCompany = {
  name: 'Mars Components Ltd',
  address_1: '12 Alpha Street',
  address_2: '',
  address_town: 'Volcanus',
  address_postcode: 'NE28 5AQ',
  id: '731bdcc1-f685-4c8e-bd66-b356b2c16995',
}

const navigateToForm = ({ project }, dataTest = 'edit') => {
  cy.intercept('GET', `/api-proxy/v3/investment/${project.id}`, {
    statusCode: 200,
    body: project,
  }).as('getProjectDetails')
  cy.visit(investments.projects.details(project.id))
  cy.get(`[data-test="${dataTest}-requirements-button"]`).click()
}

const checkIfClientConsidering = (valueToCheck) => (valueToCheck ? 3 : 2)
const checkIfSiteAddressIsCompanyAddress = (valueToCheck) => {
  if (valueToCheck === null) {
    return 2
  } else if (valueToCheck === true) {
    return 3
  } else if (valueToCheck === false) {
    return 6
  }
}
const convertBoolToYesNo = (valueToCheck) => (valueToCheck ? 'Yes' : 'No')
const convertBoolToYesNoWithNullCheck = (valueToCheck) =>
  valueToCheck === null ? null : convertBoolToYesNo(valueToCheck)

const assertSiteAddressIsCompanyAddressField = (project) => {
  it('should display the site address is company address field', () => {
    cy.get('[data-test="field-site_address_is_company_address"]').then(
      (element) => {
        assertFieldRadios({
          element,
          label:
            "Is the site address the same as the UK recipient company's address?",
          optionsCount: checkIfSiteAddressIsCompanyAddress(
            project.site_address_is_company_address
          ),
          value: convertBoolToYesNoWithNullCheck(
            project.site_address_is_company_address
          ),
        })
      }
    )
  })
  if (project.site_address_is_company_address === null) {
    it('should display the site address is company address field unselected', () => {
      assertFieldRadiosNotSelected({
        inputName: 'site_address_is_company_address',
      })
    })
  } else if (
    project.site_address_is_company_address === true &&
    project.uk_company === null
  ) {
    it('should display the inset text below the yes option', () => {
      assertFieldRadioSelected({
        inputName: 'site_address_is_company_address',
        selectedIndex: 0,
      })
      cy.get('[data-test="site_address_is_company_address"]').contains(
        'The address will appear on this form once you have selected the recipient company'
      )
    })
  } else if (
    project.site_address_is_company_address === true &&
    project.uk_company !== null
  ) {
    it('should display the inset text below the yes option', () => {
      assertFieldRadioSelected({
        inputName: 'site_address_is_company_address',
        selectedIndex: 0,
      })
      cy.get('[data-test="site_address_is_company_address"]')
        .contains(`${project.uk_company.address_1}`)
        .contains(`${project.uk_company.address_2}`)
        .contains(`${project.uk_company.address_town}`)
        .contains(`${project.uk_company.address_postcode}`)
    })
  } else if (project.site_address_is_company_address === false) {
    it('should display the address field', () => {
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
  }
}

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

  it('should correctly display the site address is company address field', () => {
    assertSiteAddressIsCompanyAddressField(project)
  })

  it('should render the active UK regions field', () => {
    const activeUkRegions = ukRegions.filter((region) => !region.disabled_on)
    cy.get('[data-test="field-actual_uk_regions"]').as('typeaheadField')
    cy.get('@typeaheadField').find('input').first().click()
    cy.get('[data-test="typeahead-menu-option"]').should('be.visible')
    cy.get('[data-test="typeahead-menu-option"]').should(
      'have.length',
      activeUkRegions.length
    )
  })

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

      cy.get('[data-test="site-address-is-company-address-no"]').click()
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

describe('Site address fields', () => {
  const siteAddressProject = (overrides) => {
    return investmentProjectFaker({
      stage: INVESTMENT_PROJECT_STAGES.prospect, // ensures all fields are optional at stage
      strategic_drivers: [
        {
          name: 'Access to market',
          id: '382aa6d1-a362-4166-a09d-f579d9f3be75',
        },
      ], // populating this field forces the `edit requirements` button to appear
      uk_company: null,
      site_address_is_company_address: null,
      address_1: null,
      address_2: null,
      address_town: null,
      address_postcode: null,
      ...overrides,
    })
  }

  context('When viewing the site address fields', () => {
    it('should show unselected radios when site address is company address is null', () => {
      const project = siteAddressProject()
      navigateToForm({ project: project })
      assertSiteAddressIsCompanyAddressField(project)
    })

    it('should show the inset text when site address is company is true and uk company is not set', () => {
      const project = siteAddressProject({
        site_address_is_company_address: true,
      })
      navigateToForm({ project: project })
      assertSiteAddressIsCompanyAddressField(project)
    })

    it('should show the company address fields when the site address is company address is true and uk company is set', () => {
      const project = siteAddressProject({
        uk_company: ukCompany,
        site_address_is_company_address: true,
      })
      navigateToForm({ project: project })
      assertSiteAddressIsCompanyAddressField(project)
    })

    it('should show the address input fields when site address is company address is false', () => {
      const project = siteAddressProject({
        site_address_is_company_address: false,
      })
      navigateToForm({ project: project })
      assertSiteAddressIsCompanyAddressField(project)
    })
  })
  context('When editing the site address fields and clicking submit', () => {
    it('should submit site address is company address is null when user does not modify field', () => {
      const project = siteAddressProject()
      navigateToForm({ project: project })
      cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`, {
        statusCode: 200,
      }).as('patchProjectRequirements')
      cy.get('[data-test="submit-button"]').click()
      cy.wait('@patchProjectRequirements')
        .its('request.body')
        .should('include', {
          site_address_is_company_address: null,
        })
    })
    it('should submit site address is company address is true and existing site address values when user selects yes and uk company is null', () => {
      const project = siteAddressProject()
      navigateToForm({ project: project })
      cy.get('[data-test="site-address-is-company-address-yes"]').click()
      cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`, {
        statusCode: 200,
      }).as('patchProjectRequirements')
      cy.get('[data-test="submit-button"]').click()
      cy.wait('@patchProjectRequirements')
        .its('request.body')
        .should('include', {
          site_address_is_company_address: true,
          address_1: project.address_1,
          address_2: project.address_2,
          address_town: project.address_town,
          address_postcode: project.address_postcode,
        })
    })
    it('should submit site address is company address is true and populate address fields when user selects yes and project has uk company', () => {
      const project = siteAddressProject({ uk_company: ukCompany })
      navigateToForm({ project: project })
      cy.get('[data-test="site-address-is-company-address-yes"]').click()
      cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`, {
        statusCode: 200,
      }).as('patchProjectRequirements')
      cy.get('[data-test="submit-button"]').click()
      cy.wait('@patchProjectRequirements')
        .its('request.body')
        .should('include', {
          site_address_is_company_address: true,
          address_1: ukCompany.address_1,
          address_2: ukCompany.address_2,
          address_town: ukCompany.address_town,
          address_postcode: ukCompany.address_postcode,
        })
    })
    it('should raise validation errors when site address is company address is false and address fields have not been populated', () => {
      const project = siteAddressProject()
      navigateToForm({ project: project })
      cy.get('[data-test="site-address-is-company-address-no"]').click()
      cy.get('[data-test="submit-button"]').click()
      assertErrorSummary([
        'Enter an address',
        'Enter a town or city',
        'Enter a postcode',
      ])
    })
    it('should submit site address is company address is false and address fields when user selects no and enters address fields', () => {
      const project = siteAddressProject()
      const address1 = 'Address line 1'
      const address2 = 'Address line 2'
      const city = 'City'
      const postcode = 'ABC 123'
      navigateToForm({ project: project })
      cy.get('[data-test="site-address-is-company-address-no"]').click()
      cy.get('[data-test="field-address1"]').type(address1)
      cy.get('[data-test="field-address2"]').type(address2)
      cy.get('[data-test="field-city"]').type(city)
      cy.get('[data-test="field-postcode"]').type(postcode)
      cy.intercept('PATCH', `/api-proxy/v3/investment/${project.id}`, {
        statusCode: 200,
      }).as('patchProjectRequirements')
      cy.get('[data-test="submit-button"]').click()
      cy.wait('@patchProjectRequirements')
        .its('request.body')
        .should('include', {
          site_address_is_company_address: false,
          address_1: address1,
          address_2: address2,
          address_town: city,
          address_postcode: postcode,
        })
    })
  })
})
