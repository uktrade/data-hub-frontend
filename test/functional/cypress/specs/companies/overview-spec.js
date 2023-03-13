const {} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Company overview page', () => {
  context(
    'when viewing company overview the tab should display Overview',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('tab should contain the text Overview', () => {
        cy.get('[data-test="tabbedLocalNavList"]')
          .children()
          .children()
          .should('contain.text', 'Overview')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table including all keys and values for All Overview Details Inc.', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th').contains('Companies House')
        cy.get('td').contains('01261539').parent().next().children()
        cy.get('th').contains('Trading Address')
        cy.get('td').children()
        cy.get('li')
          .contains('Unit 10 Ockham Drive')
          .parent()
          .parent()
          .parent()
          .next()
        cy.get('th').contains('Website')
        cy.get('td')
          .contains('http://all-the-details.com')
          .parent()
          .parent()
          .next()
        cy.get('th').contains('Turnover')
        cy.get('td').contains('£1,000,000').parent().next()
        cy.get('th').contains('Number of Employees')
        cy.get('td').contains('260').parent().next()
        cy.get('th').contains('DIT Sector')
        cy.get('td').contains('Retail')
      })

      it('the card should link to the business overview page', () => {
        cy.get('[data-test="business-page-link"]')
          .contains('View full business details')
          .click()
        cy.location('pathname').should(
          'eq',
          '/companies/ba8fae21-2895-47cf-90ba-9273c94dab88/business-details'
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Business details card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Business details table with all values set to "Not set"', () => {
        cy.get('[data-test="businessDetailsContainer"]')
          .children()
          .first()
          .contains('Business details')
          .next()
          .children()
        cy.get('th')
          .contains('Companies House')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Trading Address')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('Website').siblings().contains('td', 'Not set')
        cy.get('th').contains('Turnover').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Number of Employees')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('DIT Sector').siblings().contains('td', 'Not set')
      })
    }
  )
  context(
    'when viewing the Account management card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the Account management table including all keys and values then load 2 more contacts', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th')
          .contains('DIT Region')
          .siblings()
          .contains('td', 'South East')
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('td', 'Billy Bob')
        cy.get('th')
          .contains('One List')
          .siblings()
          .contains('td', 'Tier A - SRM Programme Accounts')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Speed')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Weight')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'View 2 more contacts')
          .click()
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Max Height')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('li', 'Baz Slow')
      })

      it('the card should link to the account management overview page', () => {
        cy.get('[data-test="account-management-page-link"]')
          .contains('View full account management')
          .click()
        cy.location('pathname').should(
          'eq',
          '/companies/ba8fae21-2895-47cf-90ba-9273c94dab88/advisers'
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Account management  card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Account management table with all values set to "Not set"', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th').contains('DIT Region').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th').contains('One List').siblings().contains('td', 'Not set')
        cy.get('th')
          .contains('Primary Contact(s)')
          .siblings()
          .contains('td', 'Not set')
      })
    }
  )
  context('clicking a primary contact on the account management card', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('should click on a primary contact and take you the contacts page', () => {
      cy.get('[data-test="accountManagementContainer"]')
        .children()
        .first()
        .contains('Account Management')
        .next()
        .children()
      cy.get('th')
        .contains('Primary Contact(s)')
        .siblings()
        .contains('a', 'Max Speed')
        .click()
      cy.location('pathname').should(
        'eq',
        '/contacts/9136dd49-df67-4b2b-b241-6b64a662f1af/details'
      )
      cy.go('back')
    })
  })
  context('clicking on the Lead ITA on the account management card', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.oneListTierDita.id)
      )
    })

    it('should click on the Lead ITA and take you the contacts page', () => {
      cy.get('[data-test="accountManagementContainer"]')
        .children()
        .first()
        .contains('Account Management')
        .next()
        .children()
      cy.get('th')
        .contains('Lead ITA')
        .siblings()
        .contains('a', 'Travis Greene')
        .click()
      cy.location('pathname').should(
        'eq',
        '/contacts/8eefe6b4-2816-4e47-94b5-a13409dcef70/details'
      )
      cy.go('back')
    })
  })
  context(
    'clicking on the Account Manager on the account management card',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('should click on the Account Manager and take you the contacts page', () => {
        cy.get('[data-test="accountManagementContainer"]')
          .children()
          .first()
          .contains('Account Management')
          .next()
          .children()
        cy.get('th')
          .contains('Account Manager')
          .siblings()
          .contains('a', 'Billy Bob')
          .click()
        cy.location('pathname').should(
          'eq',
          '/contacts/926440d6-b519-4b66-b4fd-af1646ae69ba/details'
        )
        cy.go('back')
      })
    }
  )

  context(
    'when viewing the export status card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the export status table including all keys and value', () => {
        cy.get('[data-test="exportStatusContainer"]')
          .children()
          .first()
          .contains('Export status')
          .next()
          .children()
        cy.get('th')
          .contains('Export potential')
          .siblings()
          .contains('td', 'High')
        cy.get('th')
          .contains('Export sub-segment')
          .siblings()
          .contains('td', 'sustain_nurture_and_grow')
        cy.get('th')
          .contains('Currently exporting to')
          .siblings()
          .contains('td', 'Western Sahara')
        cy.get('th')
          .contains('Future countries of interest')
          .siblings()
          .contains('td', 'Yemen')
      })

      it('the card should link to the export status overview page', () => {
        cy.get('[data-test="export-status-page-link"]')
          .contains('View full export details')
          .click()
        cy.location('pathname').should(
          'eq',
          '/companies/ba8fae21-2895-47cf-90ba-9273c94dab88/exports'
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the Export Status Card for a business that has no information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Export Status table with all values set to "Not set"', () => {
        cy.get('[data-test="exportStatusContainer"]')
          .children()
          .first()
          .contains('Export status')
          .next()
          .children()
        cy.get('th')
          .contains('Export potential')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Export sub-segment')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Currently exporting to')
          .siblings()
          .contains('td', 'Not set')
        cy.get('th')
          .contains('Future countries of interest')
          .siblings()
          .contains('td', 'Not set')
      })
    }
  )
})
