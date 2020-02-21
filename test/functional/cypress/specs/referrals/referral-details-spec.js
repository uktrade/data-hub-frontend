const { assertBreadcrumbs } = require('../../support/assertions')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Referral details', () => {
  context('when viewing referral details', () => {
    before(() => {
      cy.visit(urls.referrals.details.route)
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Referral')
    })

    it('should render a caption', () => {
      cy.get(selectors.referralDetails.table)
        .find('caption')
        .should('have.text', 'Referral sent - I am a subject')
    })

    it('should render company details', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(0)
        .should('have.text', 'CompanyLambda plc')
    })
    it('should render contact details', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(1)
        .should('have.text', 'ContactJohnny Cakeman')
    })
    it('should render sending adviser details', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(2)
        .should(
          'have.text',
          'Sending adviserIan Leggett, caravans@campervans.com, Advanced Manufacturing Sector'
        )
    })
    it('should render the sending advisers email as a link', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(2)
        .find('a')
        .should('have.attr', 'href', 'mailto:caravans@campervans.com')
    })
    it('should render receiving adviser details', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(3)
        .should(
          'have.text',
          'Receiving adviserBarry Oling, barry@barry.com, Aberdeen City Council'
        )
    })
    it('should render the receiving advisers email as a link', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(3)
        .find('a')
        .should('have.attr', 'href', 'mailto:barry@barry.com')
    })
    it('should render the date of the referral', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(4)
        .should('have.text', 'Date of referral14 Feb 2020')
    })
    it('should render the referral notes', () => {
      cy.get(selectors.referralDetails.table)
        .find('tbody tr')
        .eq(5)
        .should('have.text', 'NotesJust a note about a referral')
    })
    it('should render a details section', () => {
      cy.get(selectors.referralDetails.details)
        .find('summary')
        .should('have.text', 'Why can I not edit the referral?')
      cy.get(selectors.referralDetails.details)
        .find('div')
        .should(
          'have.text',
          'This referral has been placed in the "My referrals" section on the Homepage of both the recipient and sender. If necessary contact the receiving adviser directly if any of the information has changed.'
        )
    })
    it('should render a button for completing a referral', () => {
      cy.get(selectors.referralDetails.button).should(
        'have.text',
        'Complete referral'
      )
      cy.get(selectors.referralDetails.button).should('have.attr', 'href', '/')
    })
    it('should render a back button', () => {
      cy.get(selectors.referralDetails.backLink).should('have.text', 'Back')
      cy.get(selectors.referralDetails.backLink).should(
        'have.attr',
        'href',
        '/'
      )
    })
  })
})
