import urls from '../../../../../src/lib/urls'
import fixtures from '../../fixtures'

const assertTable = ({ element, rows }) => {
  cy.get(element).as('table')

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

describe('Investment project evidence', () => {
  context('When viewing a project with no evidence', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.evidence.index(
          fixtures.investment.investmentWithoutValue.id
        )
      )
    })

    it('should render the heading and the add button', () => {
      cy.get('[data-test="evidence-heading"]')
        .should('exist')
        .should('have.text', 'Evidence')
      cy.get('[data-test="add-evidence-button"]')
        .should('exist')
        .should('have.text', 'Add new evidence')
    })

    it('should not render the evidence table', () => {
      cy.get('[data-test="evidence-table"]').should('not.exist')
    })
  })

  context('When viewing a project with evidence', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.evidence.index(
          fixtures.investment.investmentWithLink.id
        )
      )
    })

    it('should render the heading and the add button', () => {
      cy.get('[data-test="evidence-heading"]')
        .should('exist')
        .should('have.text', 'Evidence')
      cy.get('[data-test="add-evidence-button"]')
        .should('exist')
        .should('have.text', 'Add new evidence')
    })

    it('should render the evidence table', () => {
      assertTable({
        element: '[data-test="evidence-table"]',
        rows: [
          ['Verification criteria', 'Comment', '', ''],
          [
            'Check A - FDI eligibility: New permanent jobsCheck A - FDI eligibility: Safeguarded jobsCheck B - Non-FDI: Create or maintain jobsCheck B - Non-FDI: New intellectual propertyCheck C - FDI validation: Government assistanceCheck C - FDI validation: Press releaseCheck C - FDI validation: Visit reportCheck D - Value categorisation: Export-oriented FDICheck D - Value categorisation: Investor qualityCheck D - Value categorisation: R&DCheck D - Value categorisation: Total investment value',
            'A comment on this piece of valuable evidence',
            'Download',
            'Delete',
          ],
          [
            'Check C - FDI validation: Government assistanceCheck C - FDI validation: Press release',
            '#1',
            "The file didn't pass virus scanning, contact your administrator",
            'Delete',
          ],
          [
            'Check D - Value categorisation: Total investment value',
            '#2',
            'File not virus scanned',
            'Delete',
          ],
          [
            'Check D - Commitment to Invest: Public commitment to invest',
            '#3',
            'Virus scanning scheduled',
            'Delete',
          ],
          [
            'Check D - Commitment to Invest: Expected to land',
            '#4',
            'File is being scanned, try again in a few moments',
            'Delete',
          ],
          [
            'Check C - FDI validation: Press release',
            '#5',
            'Virus scanning failed, contact your administrator',
            'Delete',
          ],
        ],
      })
    })
  })
})
