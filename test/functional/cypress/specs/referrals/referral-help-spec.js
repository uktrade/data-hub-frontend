const selectors = require('../../../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')

describe('Referral help', () => {
  context('when viewing referral help', () => {
    before(() => {
      cy.visit('/referrals/cc5b9953-894c-44b4-a4ac-d0f6a6f6128f/help')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Referral: null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'Help to complete this Referral'
      )
    })

    it('should render the content and conform to design', () => {
      cy.get('#referral-help h2:first-child')
        .should('have.text', 'More information needed')
        .next()
        .should('match', 'p')
        .should(
          'have.text',
          'If you need additional details or information about the referral, contact the adviser who sent the referral by email: Ian Leggett, caravans@campervans.com, Or find more contact details on Digital Workspace'
        )
        .next()
        .should('have.prop', 'tagName', 'H2')
        .should(
          'have.text',
          'A different adviser should follow up on this referral'
        )
        .next()
        .should('have.prop', 'tagName', 'P')
        .should(
          'have.text',
          'If you are not the right person to help this business, ask a colleague to complete the referral. You can copy and send them a direct link to the referral: http://localhost:3000/referrals/cc5b9953-894c-44b4-a4ac-d0f6a6f6128f.'
        )
        .next()
        .should('have.prop', 'tagName', 'A')
        .should(
          'have.attr',
          'href',
          '/referrals/cc5b9953-894c-44b4-a4ac-d0f6a6f6128f'
        )
        .should('have.text', 'Go back to the referral')
    })
  })
})
