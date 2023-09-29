import selectors from '../../../../selectors'
import urls from '../../../../../src/lib/urls'
import fixtures from '../../fixtures'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import {
  testBreadcrumbs,
  assertFieldUneditable,
  assertFieldInput,
  assertFieldAddress,
  assertFieldSelect,
  assertFieldRadios,
  assertDetails,
} from '../../support/assertions'

const assertRegisteredAddress = ({ element, ukBased }) =>
  cy
    .wrap(element)
    .find('legend')
    .should('have.text', 'Registered address')
    .next()
    .should(
      'have.text',
      ukBased
        ? 'A registered office address is a legal requirement of all limited' +
            ' companies and Limited Liability Partnerships (LLPs) incorporated' +
            ' in the UK. Its purpose is to provide Companies House, HMRC and' +
            ' other relevant government bodies with an official address for' +
            ' delivering statutory mail and legal notices.'
        : 'A registered office address is the official address of an' +
            ' incorporated company or any other legal entity. Its purpose is to' +
            ' provide an official address for delivering statutory mail and legal notices.'
    )

const describeCompanyEditForm = ({ company, elements }) => {
  testBreadcrumbs({
    Home: urls.dashboard.index(),
    Companies: urls.companies.index(),
    [company.name]: urls.companies.detail(company.id),
    'Business details': urls.companies.businessDetails(company.id),
    'Edit business details': null,
  })

  it('should render page contents', () => {
    const spec = [
      ...elements,
      {
        assert: ({ element }) => {
          cy.wrap(element)
            .find('button')
            .should('have.text', 'Submit')
            .next()
            .should('have.text', 'Return without saving')
            .and(
              'have.attr',
              'href',
              urls.companies.businessDetails(company.id)
            )
        },
      },
    ]

    cy.get('#edit-company-form form')
      .as('formRoot')
      .children()
      .each((element, i) => {
        if (spec[i]) {
          const { assert, ...params } = spec[i]
          assert({ element, ...params })
        }
      })
  })
}

describe('Company edit', () => {
  context('when editing unmatched UK company on the One List', () => {
    const company = fixtures.company.venusLtd
    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    it('should verify Trading name is correct', () => {
      cy.get('[data-test="field-trading_names"]').should(
        'have.text',
        'Trading name (optional)'
      )
    })

    it('should verify VAT number is correct', () => {
      cy.get('[data-test="field-vat_number"]').should(
        'have.text',
        'VAT number (optional)'
      )
    })

    it('should verify Website  is correct', () => {
      cy.get('[data-test="field-website"]').should(
        'have.text',
        'Website (optional)'
      )
    })

    it('should verify Business description is correct', () => {
      cy.get('[data-test="field-description"]').should(
        'have.text',
        'Business description (optional)'
      )
    })

    describeCompanyEditForm({
      company,
      elements: [
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
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Trading address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'DBT region',
          value: company.uk_region.name,
          optionsCount: 16,
          assert: assertFieldSelect,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
          assert: assertFieldRadios,
          optionsCount: 4,
        },
        {
          label: 'Number of employees (optional)',
          assert: assertFieldRadios,
          optionsCount: 5,
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
            ` One List, please email ${Cypress.env('one_list_email')}`,
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
            ` on the One List, please email ${Cypress.env('one_list_email')}`,
          assert: assertDetails,
        },
      ],
    })
  })

  context('when editing unmatched US company NOT on the One List', () => {
    const company = fixtures.company.marsExportsLtd

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Trading address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
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
          label: 'DBT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          label: 'Business hierarchy',
          optionsCount: 4,
          assert: assertFieldRadios,
        },
      ],
    })

    it('renders state selection errors correctly', () => {
      cy.get(selectors.companyEdit.address.areaUS).select('Select')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).contains('Select a state')
    })

    it('renders ZIP code errors if ZIP code is not valid', () => {
      cy.get(selectors.companyEdit.address.postcode).clear()
      cy.get(selectors.companyEdit.address.postcode).type('ABC 123')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).contains('Enter a valid ZIP code')
    })

    it('does not render ZIP code errors if ZIP code is valid', () => {
      cy.get(selectors.companyEdit.address.postcode).clear()
      cy.get(selectors.companyEdit.address.postcode).type('12345')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).should(
        'not.contain',
        'Enter a valid ZIP code'
      )
    })
  })

  context('when editing unmatched Canadian company NOT on the One List', () => {
    const company = fixtures.company.canadianCompany

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Trading address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'Annual turnover (optional)',
          hint: 'Amount in GBP',
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
          label: 'DBT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          label: 'Business hierarchy',
          optionsCount: 4,
          assert: assertFieldRadios,
        },
      ],
    })

    it('renders province selection errors correctly', () => {
      cy.get(selectors.companyEdit.address.areaCanada).select('Select')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).contains('Select a province')
    })

    it('renders postal code errors if postal code is not valid', () => {
      cy.get(selectors.companyEdit.address.postcode).clear()
      cy.get(selectors.companyEdit.address.postcode).type('ABC 123')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).contains('Enter a valid Postal code')
    })

    it('does not render postal code errors if postal code is valid', () => {
      cy.get(selectors.companyEdit.address.postcode).clear()
      cy.get(selectors.companyEdit.address.postcode).type('A1A 1A1')
      cy.contains('Submit').click()
      cy.get(selectors.companyEdit.form).should(
        'not.contain',
        'Enter a valid Postal code'
      )
    })
  })

  context('when editing matched UK company NOT on the One List', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.visit(urls.companies.edit(company.id))
    })

    describeCompanyEditForm({
      company,
      elements: [
        {
          label: 'Company name',
          value: company.name,
          assert: assertFieldInput,
        },
        {
          label: 'Trading name (optional)',
          value: company.trading_names[0],
          assert: assertFieldInput,
        },
        {
          label: 'Website (optional)',
          value: company.website,
          assert: assertFieldInput,
        },
        {
          label: 'Business description (optional)',
          value: company.description,
          assert: assertFieldInput,
        },
        {
          label: 'Export Segment (optional)',
          value: company.segment,
          optionsCount: 3,
          assert: assertFieldSelect,
        },
        {
          label: 'Export Sub-segment (optional)',
          value: company.sub_segment,
          optionsCount: 13,
          assert: assertFieldSelect,
        },
        {
          label: 'Trading address',
          value: company.address,
          hint:
            'This should be the address for this particular office of the' +
            ' business. If you need to record activity or a contact for a' +
            ' different address, please add a new company record to Data Hub.',
          assert: assertFieldAddress,
        },
        {
          ukBased: company.uk_based,
          assert: assertRegisteredAddress,
        },
        {
          label: 'Annual turnover',
          hint: 'Amount in GBP',
          value: currencyGBP(company.turnover_gbp, {
            maximumSignificantDigits: 2,
          }),
          assert: assertFieldUneditable,
        },
        {
          label: 'Number of employees',
          value: company.number_of_employees,
          assert: assertFieldUneditable,
        },
        {
          label: 'DBT sector',
          value: company.sector.name,
          optionsCount: 256,
          assert: assertFieldSelect,
        },
        {
          assert: ({ element }) =>
            cy
              .wrap(element)
              .should('have.text', 'After you click submit')
              .and('match', 'h2'),
        },
        {
          assert: ({ element }) =>
            cy
              .wrap(element)
              .should(
                'have.text',
                'Changes will be reviewed by our third-party data' +
                  ' supplier and updated. Business description, website, region and' +
                  ' sector are not updated by third parties.'
              ),
        },
      ],
    })
  })

  context('when form is submitted for a matched company', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.intercept('POST', urls.companies.edit(company.id) + '*', {
        body: { company: company },
      }).as('editCompanyResponse')
      cy.visit(urls.companies.edit(company.id))
    })

    it('should redirect to the business details page', () => {
      cy.contains('Company name')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('Test company name')

      cy.contains('Trading name')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('Test company trading name')

      cy.contains('Website (optional)')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('example.com')

      cy.contains('Submit').click()

      cy.wait('@editCompanyResponse').then((xhr) => {
        expect(xhr.request.body.name).to.equal('Test company name')
        expect(xhr.request.body.trading_names).to.equal(
          'Test company trading name'
        )
        expect(xhr.request.body.website).to.equal('example.com')
      })

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
    })

    it('displays the "Change requested. Thanks for keeping Data Hub running smoothly" flash message and the ID used in GA', () => {
      cy.contains(
        'Change requested.Thanks for keeping Data Hub running smoothly.'
      ).should('have.attr', 'data-test', 'status-message')
    })
  })

  context('when form is submitted with dnb change request', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.intercept('POST', urls.companies.edit(company.id) + '*', {
        body: { dnbChangeRequest: { duns_number: company.duns_number } },
      }).as('editCompanyResponse')
      cy.visit(urls.companies.edit(company.id))
    })

    it('should display the "Change requested. Thanks for keeping Data Hub running smoothly"', () => {
      cy.contains('Company name')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('Test company name')

      cy.contains('Trading name')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('Test company trading name')

      cy.contains('Website (optional)')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('example.com')

      cy.contains('Submit').click()

      cy.contains(
        'Change requested.Thanks for keeping Data Hub running smoothly.'
      ).should('have.attr', 'data-test', 'status-message')
    })
  })

  context('when form is submitted for unmatched company', () => {
    const company = fixtures.company.marsExportsLtd

    before(() => {
      cy.intercept('POST', urls.companies.edit(company.id) + '*').as(
        'editCompanyResponse'
      )
      cy.visit(urls.companies.edit(company.id))
    })

    it('should update the company record and redirect to the business details', () => {
      cy.contains('Trading name')
        .parent()
        .next()
        .find('input')
        .clear()
        .type('Test company trading name')
      cy.contains('Submit').click()

      cy.wait('@editCompanyResponse').then((xhr) => {
        expect(xhr.request.body.trading_names).to.equal(
          'Test company trading name'
        )
      })

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
      cy.contains('Company record updated')
    })
  })

  context('when the form is submitted and there are no changes', () => {
    const company = fixtures.company.dnbLtd

    before(() => {
      cy.server()
      cy.visit(urls.companies.edit(company.id))
    })

    it('should redirect back to the Business Details page', () => {
      cy.contains('Submit').click()
      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(company.id)
      )
    })
  })
})
