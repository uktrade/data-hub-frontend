const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors/index.js')

describe('Companies interactions', () => {
  context('when viewing interactions for a Dun & Bradstreet GHQ company on the One List not in the UK', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}`)
    })

    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'One List Corp')
    })

    it('should display the address', () => {
      cy.get(selectors.localHeader().headingAfter).should('have.text', '12 St George\'s Road, Paris, 75001, France')
    })

    it('should display the badge', () => {
      cy.get(selectors.localHeader().badge(1)).should('have.text', 'Global HQ')
    })

    it('should display the One List tier', () => {
      const expected = 'This is an account managed company (One List Tier A - Strategic Account)'
      cy.get(selectors.localHeader().description.paragraph(1)).should('have.text', expected)
    })

    it('should display the Global Account Manager', () => {
      const expected = 'Global Account Manager: Travis Greene View core team'
      cy.get(selectors.localHeader().description.paragraph(2)).should('have.text', expected)
    })

    it('should display the "View full business details" link', () => {
      const selector = selectors.localHeader().viewFullBusinessDetailsLink(fixtures.company.oneListCorp.id)
      cy.get(selector).should('have.text', 'View full business details')
    })

    it('should display the local nav', () => {
      cy.get(selectors.tabbedLocalNav().item(1)).should('have.text', 'Interactions')
      cy.get(selectors.tabbedLocalNav().item(2)).should('have.text', 'Company contacts')
      cy.get(selectors.tabbedLocalNav().item(3)).should('have.text', 'Core team')
      cy.get(selectors.tabbedLocalNav().item(4)).should('have.text', 'Investment')
      cy.get(selectors.tabbedLocalNav().item(5)).should('have.text', 'Export')
      cy.get(selectors.tabbedLocalNav().item(6)).should('have.text', 'Orders')
    })

    it('the "Interactions" should be active', () => {
      cy.get(selectors.tabbedLocalNav().selected).should('have.text', 'Interactions')
    })

    it('should display the "Company interactions" heading', () => {
      cy.get(selectors.companyInteraction().heading).should('have.text', 'Company interactions')
    })

    it('should not display the "Add interaction" button', () => {
      cy.get(selectors.companyInteraction().addButton(fixtures.company.oneListCorp.id)).should('not.exist')
    })
  })
})
