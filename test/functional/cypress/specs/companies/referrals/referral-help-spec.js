const urls = require('../../../../../../src/lib/urls')
const {
  id: companyId,
} = require('../../../../../sandbox/fixtures/v4/company/company-lambda-plc')

const selectors = require('../../../../../selectors')
const { assertBreadcrumbs } = require('../../../support/assertions')

describe('Referral help', () => {
  context('when viewing referral help', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.help(companyId, '1'))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index.route,
        Companies: urls.companies.index(),
        'Lambda plc': urls.companies.detail(companyId),
        Referral: urls.companies.referrals.details(companyId, '1'),
        'I cannot accept this referral': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'I cannot accept this referral'
      )
    })

    it('should render the content and conform to design', () => {
      cy.get('h2')
        .should('contain', 'I need more information')
        .next()
        .should('match', 'p')
        .should(
          'contain',
          'Contact the sender for more info: Ian Leggett, caravans@campervans.com'
        )
        .next()
        .should(
          'contain',
          'Or find their contact details on the Intranet (opens in new tab)'
        )
        .next()
        .should('have.prop', 'tagName', 'H2')
        .should('contain', "I'm not the right adviser for this")
        .next()
        .should('have.prop', 'tagName', 'P')
        .should(
          'contain.text',
          'Forward this referral onto someone else. Paste this URL into an email:'
        )
        .should(
          'contain.text',
          `${urls.companies.referrals.details(companyId, '1')}`
        )
        .next()
        .should('have.prop', 'tagName', 'A')
        .should(
          'have.attr',
          'href',
          urls.companies.referrals.details(companyId, '1')
        )
        .should('contain', 'Back to the referral')
    })

    it('should link to people finder', () => {
      cy.contains('Intranet').should(
        'have.attr',
        'href',
        urls.external.digitalWorkspace.teams
      )
    })
  })
})
