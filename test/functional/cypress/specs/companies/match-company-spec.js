const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertSummaryList,
} = require('../../support/assertions')

const DUNS_NUMBER = '111222333'

const performSearch = (companyName = 'some company') => {
  cy.get(selectors.companyMatch.find.companyNameInput)
    .clear()
    .type(companyName)
  cy.get(selectors.companyMatch.find.button).click()
}

describe('Match a company', () => {
  context('when viewing "Find this company record" page', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Find this company record': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('Find this company record')
    })

    it('should render the Data Hub record', () => {
      cy.contains('Existing Data Hub company record')
        .should('have.prop', 'tagName', 'H2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Company name': 'Venus Ltd',
            'Located at': '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
          })
        )
    })

    it('should render both search input fields and a button', () => {
      cy.contains('Find the verified third party company record')
        .and('have.prop', 'tagName', 'H2')
        .next()
        .children()
        .first()
        .should('have.text', 'Company name')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .should('have.text', 'Company postcode (optional)')
        .find('input')
        .should('have.attr', 'type', 'search')
        .parent()
        .parent()
        .next()
        .contains('Find company')
        .and('have.prop', 'tagName', 'BUTTON')
    })

    it('should prepopulate company name and postcode text fields', () => {
      cy.get(selectors.companyMatch.find.companyNameInput).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.name
      )
      cy.get(selectors.companyMatch.find.postcodeField).should(
        'have.attr',
        'value',
        fixtures.company.venusLtd.address.postcode
      )
    })
  })

  context(
    'when the "Find company" button is clicked without providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      })

      it('should display error message', () => {
        cy.get(selectors.companyMatch.find.companyNameInput).clear()
        cy.get(selectors.companyMatch.find.button)
          .click()
          .get(selectors.companyMatch.form)
          .contains('Enter company name')
      })

      it('should not display the search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'not.be.visible'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'not.be.visible'
        )
      })
    }
  )

  context(
    'when the "Find company" button is clicked providing a company name',
    () => {
      before(() => {
        cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
        performSearch()
      })

      it('should display the company search results', () => {
        cy.get(selectors.companyMatch.find.results.someCompany).should(
          'be.visible'
        )
        cy.get(selectors.companyMatch.find.results.someOtherCompany).should(
          'be.visible'
        )
      })
    }
  )

  context('when one of the search results is clicked', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.dnbCorp.id))
      performSearch()
      cy.get(selectors.companyMatch.find.results.someCompany).click()
    })

    it('should redirect to the the match confirmation page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.match.confirmation(fixtures.company.dnbCorp.id, 12345678)
      )
    })
  })

  context('when "I still cannot find the company" is clicked', () => {
    before(() => {
      cy.visit(urls.companies.match.index(fixtures.company.venusLtd.id))
      performSearch()
      cy.contains('I cannot find the company I am looking for').click()
      cy.contains('I still cannot find the company').click()
    })

    it('should redirect to the cannot find match page', () => {
      cy.location('pathname').should(
        'eq',
        urls.companies.match.cannotFind(fixtures.company.venusLtd.id)
      )
    })

    it('should render the header', () => {
      assertLocalHeader('Unable to find matching company record')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [fixtures.company.venusLtd.name]: urls.companies.detail(
          fixtures.company.venusLtd.id
        ),
        'Unable to find matching company record': null,
      })
    })

    it('should display the page content', () => {
      cy.contains(
        'The message on the company page asking to update this record will remain visible, so you or other Data Hub users can try (again) to find the matching Dun & Bradstreet record.'
      )
        .parent()
        .next()
        .should(
          'have.text',
          'In the meantime you can continue to add interaction or other activity for this company record.'
        )
        .next()
        .should('have.text', 'Return to the company page')
        .and('have.prop', 'tagName', 'A')
        .and(
          'have.attr',
          'href',
          urls.companies.detail(fixtures.company.venusLtd.id)
        )
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
        'Your request to update this company record has been sent.' +
          'In the near future the Support Team will update this company ' +
          'record and enable automatic updates for future changes to the company information.'
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
            'Company name': 'DnB Corp',
            'Located at': '1 Main Road, Rome, 001122, Italy',
          })
        )
        .parent()
        .parent()
        .next()
        .should(
          'have.text',
          'With this verified third party company information'
        )
        .and('have.prop', 'tagName', 'H2')
        .next()
        .find('dl')
        .then(($el) =>
          assertSummaryList($el, {
            'Company name': 'Some company name',
            'Located at': '123 Fake Street, Brighton, BN1 4SE, United Kingdom',
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
