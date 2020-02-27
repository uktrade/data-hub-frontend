const selectors = require('../../../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')

describe('Referral details', () => {
  context('when viewing referral details', () => {
    before(() => {
      cy.visit('/referrals/cc5b9953-894c-44b4-a4ac-d0f6a6f6128f')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Referral: null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Referral')
    })

    it('should render the content and elements in order', () => {
      cy.get('#referral-details > table')
        .find('caption')
        .should('have.text', 'Referral sent - I am a subject')
        .parents()
        .find('tbody tr')
        .eq(0)
        .should('have.text', 'CompanyLambda plc')
        .parents()
        .find('tbody tr')
        .eq(1)
        .should('have.text', 'ContactJohnny Cakeman')
        .parents()
        .find('tbody tr')
        .eq(2)
        .should(
          'have.text',
          'Sending adviserIan Leggett, caravans@campervans.com, Advanced Manufacturing Sector'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:caravans@campervans.com')
        .parents()
        .find('tbody tr')
        .eq(3)
        .should(
          'have.text',
          'Receiving adviserBarry Oling, barry@barry.com, Aberdeen City Council'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:barry@barry.com')
        .parents()
        .find('tbody tr')
        .eq(4)
        .should('have.text', 'Date of referral14 Feb 2020')
        .parents()
        .find('tbody tr')
        .eq(5)
        .should('have.text', 'NotesJust a note about a referral')
        .parents()
        .find('summary')
        .should('have.text', 'Why can I not edit the referral?')
        .next()
        .should(
          'have.text',
          'This referral has been placed in the "My referrals" section on the Homepage of both the recipient and sender. If necessary contact the receiving adviser directly if any of the information has changed.'
        )
        .parents()
        .find('details')
        .next()
        .find('a:first-child')
        .should('have.text', 'Complete referral')
        .parent()
        .find('a:nth-child(2)')
        .should('have.text', 'I cannot complete the referral')
        .should(
          'have.attr',
          'href',
          '/referrals/cc5b9953-894c-44b4-a4ac-d0f6a6f6128f/help'
        )
        .parent()
        .find('a:nth-child(3)')
        .should('have.text', 'Back')
    })
  })
})
