const minimallyMinimal = require('../../../../../sandbox/fixtures/v4/company/company-minimally-minimal.json')
const dnbLimited = require('../../../../../sandbox/fixtures/v4/company/company-dnb-ltd.json')
const urls = require('../../../../../../src/lib/urls')
const { assertFieldSelect } = require('../../../support/assertions')

describe('Company Export tab - Edit exports', () => {
  function assertReadOnlyItems(rows) {
    const DT_ALIAS = 'dt-items'
    const DD_ALIAS = 'dd-items'
    cy.get('dl').find('dt').as(DT_ALIAS).parent().find('dd').as(DD_ALIAS)
    rows.forEach((row, index) => {
      cy.get('@' + DT_ALIAS)
        .eq(index)
        .should('have.text', row.label)
      cy.get('@' + DD_ALIAS)
        .eq(index)
        .should('have.text', row.value)
    })
  }

  function assertButtons(companyId) {
    cy.contains('button', 'Save and return')
    cy.contains('a', 'Return without saving').should(
      'have.attr',
      'href',
      urls.companies.exports.index(companyId)
    )
  }

  context(
    'Without an existing export win category, great profile or export potential',
    () => {
      const XHR_ALIAS = 'save-export-edit-1'

      beforeEach(() => {
        cy.visit(urls.companies.exports.edit(minimallyMinimal.id))
        cy.intercept('PATCH', '*/v4/company/*').as(XHR_ALIAS)
      })

      it('Should render a list without a selected item', () => {
        cy.get('#field-export_experience_category').then((element) => {
          assertFieldSelect({
            element,
            label: 'Export win category (optional)',
            value: '-- Select category --',
            optionsCount: 7,
          })
        })
      })

      it('Should render the read only items', () => {
        assertReadOnlyItems([
          {
            label: 'great.gov.uk business profile',
            value: 'No profile',
          },
          { label: 'Export potential', value: 'No score given' },
          { label: 'Export potential last updated', value: 'No score given' },
        ])
      })

      it('Should render the buttons and clicking Save should save the value', () => {
        assertButtons(minimallyMinimal.id)

        //selecting a real value should send the UUID
        cy.get('#export_experience_category').select('Export growth')

        cy.contains('Save and return').click()

        cy.wait('@' + XHR_ALIAS).then((xhr) => {
          expect(xhr.response.url).to.contain(minimallyMinimal.id)
          expect(xhr.request.body.export_experience_category).to.equal(
            '73023b55-9568-4e3f-a134-53ec58451d3f'
          )
        })
      })
    }
  )

  context(
    'With an existing export win category, great profile and export potential',
    () => {
      const XHR_ALIAS = 'save-export-edit-2'

      beforeEach(() => {
        cy.visit(urls.companies.exports.edit(dnbLimited.id))
        cy.intercept('PATCH', '*/v4/company/*').as(XHR_ALIAS)
      })

      it('Should render a list without a selected item', () => {
        cy.get('#field-export_experience_category').then((element) => {
          assertFieldSelect({
            element,
            label: 'Export win category (optional)',
            value: 'Increasing export turnover',
            optionsCount: 7,
          })
        })
      })

      it('Should render the read only items', () => {
        assertReadOnlyItems([
          {
            label: 'great.gov.uk business profile',
            value: '"Find a supplier" profile (opens in new tab)',
          },
          { label: 'Export potential', value: 'Medium' },
          { label: 'Export potential last updated', value: '2024-03-07' },
        ])

        cy.contains('"Find a supplier" profile').should(
          'have.attr',
          'href',
          urls.external.great.companyProfile(dnbLimited.company_number)
        )
      })

      it('Should render the buttons and clicking Save should save the value', () => {
        assertButtons(dnbLimited.id)

        cy.get('#export_experience_category').select('-- Select category --')

        cy.contains('Save and return').click()

        cy.wait('@' + XHR_ALIAS).then((xhr) => {
          expect(xhr.response.url).to.contain(dnbLimited.id)
          expect(xhr.request.body.export_experience_category).to.equal(null)
        })
      })
    }
  )
})
