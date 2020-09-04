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
        .eq(0)
        .find('caption')
        .should('have.text', 'I am a subject')
        .parents()
        .find('tbody tr')
        .as('row')
        .eq(0)
        .should('have.text', 'CompanyLambda plc')
        .find('a')
        .should(
          'have.attr',
          'href',
          urls.companies.detail(companyId, REFERRAL_ID)
        )

      cy.get('@row')
        .eq(1)
        .should('have.text', 'ContactHelena Referral')
        .find('a')
        .and(
          'have.attr',
          'href',
          urls.contacts.contact('6891d583-7f52-41af-a0d3-d8d527f20d43')
        )

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

      cy.get('@row').eq(4).should('have.text', 'Date of referral14 Feb 2020')

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
        .eq(0)
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

      cy.get('@row').eq(3).should('have.text', 'Date of referral14 Feb 2020')

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

  context('when viewing details of a complete referral', () =>
    it('should display the Referral accepted summary instead of the buttons', () => {
      cy.visit(urls.companies.referrals.details('any-id-will-do', 'completed'))

      cy.contains('Complete referral').should('not.exist')
      cy.contains('I cannot complete the referral').should('not.exist')

      cy.contains('Referral accepted')
        .next()
        .within(() => {
          cy.get('tr')
            .as('row')
            .eq(0)
            .within(() => {
              cy.get('th').should('have.text', 'Date')
              cy.get('td').should('have.text', '19 Mar 2020')
            })

          cy.get('@row')
            .eq(1)
            .within(() => {
              cy.get('th').should('have.text', 'By')
              cy.get('td')
                .should(
                  'have.text',
                  'Andy Pipkin, andy.pipkin@little.britain.co.uk, Andy & Lou'
                )
                .find('a')
                .should('have.text', 'andy.pipkin@little.britain.co.uk')
                .and(
                  'have.attr',
                  'href',
                  'mailto:andy.pipkin@little.britain.co.uk'
                )
            })

          cy.get('@row')
            .eq(2)
            .within(() => {
              cy.get('th').should('have.text', 'With interaction')
              cy.get('td')
                .find('a')
                .should('have.text', 'Covert action')
                .and('have.attr', 'href', '/interactions/foo-bar-baz')
            })
        })
    })
  )
  context('When you come to the details page from /my-referrals', () => {
    it('should take you back there when you click "back"', () => {
      cy.visit(urls.dashboard())
      cy.contains('My referrals').click()
      cy.contains('Andy to Lou').click()
      cy.contains('Back').should(
        'have.attr',
        'href',
        urls.companies.referrals.list()
      )
    })
  })
  context(
    'When you come to the details page from anywhere but the homepage',
    () => {
      it('should take you to the company page when you click "back"', () => {
        cy.visit(
          urls.companies.referrals.details(companyId, REFERRAL_ID_NO_CONTACT)
        )
        cy.contains('Back').should(
          'have.attr',
          'href',
          urls.companies.detail(companyId)
        )
      })
    }
  )
})
