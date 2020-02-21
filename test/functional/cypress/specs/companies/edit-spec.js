import {
  assertBreadcrumbs,
  assertFieldUneditable,
  assertFieldInput,
  assertFieldAddress,
  assertFieldSelect,
  assertFieldRadios,
  assertDetails,
} from '../../support/assertions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const assertRegisteredAddress = ({ element }) =>
  cy
    .wrap(element)
    .find('legend')
    .should('have.text', 'Registered address')
    .next()
    .should(
      'have.text',
      'A registered office address is a legal requirement of all limited' +
        ' companies and Limited Liability Partnerships (LLPs) incorporated' +
        ' in the UK. Its purpose is to provide Companies House, HMRC and' +
        ' other relevant government bodies with an official address for' +
        ' delivering statutory mail and legal notices.'
    )

const describeCompanyEditForm = ({ company, elements }) => {
  beforeEach(() => {
    cy.server()
    cy.route('POST', urls.companies.edit(company.id) + '*').as(
      'editCompanyResponse'
    )
    cy.visit(urls.companies.edit(company.id))
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: '/companies',
      [company.name]: urls.companies.detail(company.id),
      'Business details': urls.companies.businessDetails(company.id),
      'Edit business details': null,
    })
  })

  it('should render form elements and submit the form', () => {
    const formElements = [
      ...elements,
      {
        assert: ({ element }) =>
          cy
            .wrap(element)
            .find('button')
            .should('have.text', 'Save and return')
            .next()
            .should('have.text', 'Return without saving')
            .and(
              'have.attr',
              'href',
              urls.companies.businessDetails(company.id)
            ),
      },
    ]

    cy.get('#edit-company-form form div')
      .as('formRoot')
      .children()
      .each((element, i) => {
        if (formElements[i]) {
          const { assert, ...params } = formElements[i]
          assert({ element, ...params })
        }
      })

    cy.contains('Save and return').click()
    cy.location('pathname').should(
      'eq',
      urls.companies.businessDetails(company.id)
    )
    cy.contains('Company record updated')
  })
}

describe('Company edit', () => {
  context('when updating matched UK company NOT on the One List', () => {
    const company = fixtures.company.dnbLtd
    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'DIT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
      ],
    })
  })

  context('when updating unmatched UK company on the One List', () => {
    const company = fixtures.company.venusLtd
    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Business type',
          value: 'Company',
          assert: assertFieldUneditable,
        },
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'VAT number (optional)',
          value: company.vat_number,
          assert: assertFieldInput,
        },
        {
          label: 'Annual turnover (optional)',
          value: null,
          assert: assertFieldRadios,
          optionsCount: 4,
        },
        {
          label: 'Number of employees (optional)',
          value: null,
          assert: assertFieldRadios,
          optionsCount: 5,
        },
        {
          label: "Company's website (optional)",
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          assert: assertRegisteredAddress,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'DIT region',
          value: company.uk_region.name,
          optionsCount: 16,
          assert: assertFieldSelect,
        },
        {
          label: 'Sector',
          value: company.sector.name,
          assert: assertFieldUneditable,
        },
        {
          summary: 'Need to edit the sector?',
          content:
            'If you need to change the sector for a company on the' +
            ' One List, please email onelist@example.com',
          assert: assertDetails,
        },
        {
          label: 'Business hierarchy',
          value: 'Not a headquarters',
          assert: assertFieldUneditable,
        },
        {
          summary: 'Need to edit the headquarter type?',
          content:
            'If you need to change the headquarter type for a company' +
            ' on the One List, please email onelist@example.com',
          assert: assertDetails,
        },
      ],
    })
  })

  context('when updating unmatched foreign company NOT on the One List', () => {
    const company = fixtures.company.marsExportsLtd
    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Business type',
          value: 'Company',
          assert: assertFieldUneditable,
        },
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Annual turnover (optional)',
          value: company.turnover_range.name,
          assert: assertFieldRadios,
          optionsCount: 4,
        },
        {
          label: 'Number of employees (optional)',
          value: company.employee_range.name,
          assert: assertFieldRadios,
          optionsCount: 5,
        },
        {
          label: "Company's website (optional)",
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          assert: assertRegisteredAddress,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'DIT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          label: 'Business hierarchy',
          value: null,
          optionsCount: 4,
          assert: assertFieldRadios,
        },
      ],
    })
  })

  context('when updating a matched UK company not on the One List', () => {
    describeCompanyEditForm({
      elements: [
        {
          label: 'Business description (optional)',
          value: fixtures.company.dnbLtd.description,
          assert: assertFieldInput,
        },
        {
          label: 'DIT sector',
          value: fixtures.company.dnbLtd.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
      ],
      company: fixtures.company.dnbLtd,
    })
  })
})
