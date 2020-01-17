const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertSummaryList,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')

const DUNS_NUMBER = '111222333'

describe('Match a company', () => {
  context('when viewing "Find this company record" page', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
    })

    it('should render the header', () => {
      assertLocalHeader('Find this company record')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Find this company record': null,
      })
    })
  })

  context('when company matching is confirmed', () => {
    before(() => {
      cy.visit(
        urls.companies.match.confirmation(
          fixtures.company.venusLtd.id,
          DUNS_NUMBER
        )
      )
      cy.contains('Send update request').click()
    })

    it('should redirect to the company page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.activity.index(fixtures.company.venusLtd.id)
      )
    })

    it('displays the "Company record update request sent" flash message', () => {
      cy.get(selectors.localHeader().flash).should(
        'contain.text',
        'Company record update request sent'
      )
    })
  })

  context('when viewing "Confirm update" page', () => {
    before(() => {
      cy.visit(
        urls.companies.match.confirmation(
          fixtures.company.dnbCorp.id,
          DUNS_NUMBER
        )
      )
    })

    it('should render the header', () => {
      assertLocalHeader('Confirm update')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.dnbCorp.name]: urls.companies.detail(
          fixtures.company.dnbCorp.id
        ),
        'Confirm update': null,
      })
    })

    it('should display matching confirmation details', () => {
      cy.contains('Confirm you want to update this Data Hub company record')
        .should('have.prop', 'tagName', 'H2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Registered company name': 'DnB Corp',
            'Trading name(s)': 'DnB, D&B',
            'Located at': '1 Main Road, Rome, 001122, Italy',
            'Registered address': '1 Main Road, Rome, 001122, Italy',
          })
        )
        .parent()
        .parent()
        .next()
        .should(
          'have.text',
          'With the information from this Dun & Bradstreet company record'
        )
        .and('have.prop', 'tagName', 'H2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Registered company name': 'Some company name',
            'Trading name(s)': 'Some trading name',
            'Located at': '123 Fake Street, Brighton, BN1 4SE, United Kingdom',
            'Registered address': 'Brighton, BN1 4SE, United Kingdom',
          })
        )
        .parent()
        .parent()
        .next()
        .should('have.text', 'What happens next')
        .and('have.prop', 'tagName', 'H2')
        .next()
        .children()
        .should('have.length', 2)
        .and(
          'contain',
          'This will send a request to the Support Team to update the business details for this company record, including any future changes to this information.'
        )
        .and(
          'contain',
          'This will NOT change any recorded activity (Interactions, OMIS orders or Investments projects) for this company record.'
        )
        .parent()
        .next()
        .contains('Send update request')
        .and('have.prop', 'tagName', 'BUTTON')
        .next()
        .contains('Back')
        .should(
          'have.attr',
          'href',
          urls.companies.match.index(fixtures.company.dnbCorp.id)
        )
    })
  })
})
