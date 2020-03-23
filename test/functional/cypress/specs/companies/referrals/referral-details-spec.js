const urls = require('../../../../../../src/lib/urls')
const {
  id: companyId,
} = require('../../../../../sandbox/fixtures/v4/company/company-lambda-plc')

const selectors = require('../../../../../selectors')
const { assertBreadcrumbs } = require('../../../support/assertions')
const {
  REFERRAL_ID,
  REFERRAL_ID_NO_CONTACT,
} = require('../../../../../sandbox/constants/referrals')

describe('Referral details', () => {
  context('when viewing referral details', () => {
    before(() =>
      cy.visit(urls.companies.referrals.details(companyId, REFERRAL_ID))
    )

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Companies: '/companies',
        'Lambda plc': urls.companies.detail(companyId),
        Referral: null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Referral')
    })

    it('should render the content and elements in order', () => {
      cy.get('#referral-details > table')
        .find('caption')
        .should('have.text', 'I am a subject')
        .parents()
        .find('tbody tr')
        .as('row')
        .eq(0)
        .should('have.text', 'CompanyLambda plc')

      cy.get('@row')
        .eq(1)
        .should('have.text', 'ContactJohnny Cakeman')

      cy.get('@row')
        .eq(2)
        .should(
          'have.text',
          'Sending adviserIan Leggett, caravans@campervans.com, Advanced Manufacturing Sector'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:caravans@campervans.com')

      cy.get('@row')
        .eq(3)
        .should(
          'have.text',
          'Receiving adviserBarry Oling, barry@barry.com, Aberdeen City Council'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:barry@barry.com')

      cy.get('@row')
        .eq(4)
        .should('have.text', 'Date of referral14 Feb 2020')

      cy.get('@row')
        .eq(5)
        .should('have.text', 'NotesJust a note about a referral')
        .parents()
        .find('summary')
        .should('have.text', 'Why can I not edit the referral?')
        .next()
        .should(
          'have.text',
          "For now, you can't edit the referral once it's been sent.Contact the recipient if something's changed."
        )
        .parents()
        .find('details')
        .next()
        .find('a:first-child')
        .should('have.text', 'Accept referral')
        .parent()
        .find('a:nth-child(2)')
        .should('have.text', 'I cannot accept the referral')
        .should(
          'have.attr',
          'href',
          urls.companies.referrals.help(companyId, REFERRAL_ID)
        )
        .parent()
        .find('a:nth-child(3)')
        .should('have.text', 'Back')
    })
  })

  context('when viewing referral details with no contact', () => {
    before(() =>
      cy.visit(
        urls.companies.referrals.details(companyId, REFERRAL_ID_NO_CONTACT)
      )
    )

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Companies: '/companies',
        'Lambda plc': urls.companies.detail(companyId),
        Referral: null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Referral')
    })

    it('should render the content and elements in order', () => {
      cy.get('#referral-details > table')
        .find('caption')
        .should('have.text', 'I am a subject')
        .parents()
        .find('tbody tr')
        .as('row')
        .eq(0)
        .should('have.text', 'CompanyLambda plc')

      cy.get('@row')
        .eq(1)
        .should(
          'have.text',
          'Sending adviserIan Leggett, caravans@campervans.com, Advanced Manufacturing Sector'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:caravans@campervans.com')

      cy.get('@row')
        .eq(2)
        .should(
          'have.text',
          'Receiving adviserBarry Oling, barry@barry.com, Aberdeen City Council'
        )
        .find('a')
        .should('have.attr', 'href', 'mailto:barry@barry.com')

      cy.get('@row')
        .eq(3)
        .should('have.text', 'Date of referral14 Feb 2020')

      cy.get('@row')
        .eq(4)
        .should('have.text', 'NotesJust a note about a referral')
        .parents()
        .find('summary')
        .should('have.text', 'Why can I not edit the referral?')
        .next()
        .should(
          'have.text',
          "For now, you can't edit the referral once it's been sent.Contact the recipient if something's changed."
        )
        .parents()
        .find('details')
        .next()
        .find('a:first-child')
        .should('have.text', 'Accept referral')
        .parent()
        .find('a:nth-child(2)')
        .should('have.text', 'I cannot accept the referral')
        .should(
          'have.attr',
          'href',
          urls.companies.referrals.help(companyId, REFERRAL_ID_NO_CONTACT)
        )
        .parent()
        .find('a:nth-child(3)')
        .should('have.text', 'Back')
    })
  })
})
