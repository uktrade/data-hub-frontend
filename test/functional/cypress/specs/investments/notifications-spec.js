const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { localHeader, nav } = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

describe('Notification settings with all options', () => {
  context('when the user does not have the feature flag set', () => {
    before(() => {
      cy.resetUser()
      cy.visit(
        urls.investments.notificationSettings.index(
          fixtures.investment.notificationSettingsAll.id
        ),
        { failOnStatusCode: false }
      )
    })
    it('should return 404', () => {
      cy.get(localHeader().heading).should('contain.text', 'Page not found')
    })
  })
})

describe('Notification settings with all options', () => {
  context('when viewing the "Notifications" page with all settings', () => {
    before(() => {
      cy.setUserFeatures(['notifications'])
      cy.visit(
        urls.investments.notificationSettings.index(
          fixtures.investment.notificationSettingsAll.id
        )
      )
    })

    it('should render the header', () => {
      assertLocalHeader('Notification settings')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        'Wig factory': urls.investments.projects.project(
          fixtures.investment.notificationSettingsAll.id
        ),
        Notifications: null,
      })
    })

    it('should display the notificaion options', () => {
      cy.get('[data-test="notifications-estimated-land-date"]').should(
        'have.text',
        '30 days before60 days before'
      )
    })

    it('should link to individual settings page', () => {
      cy.get('[data-test="notifications-estimated-land-date-link"]')
        .should('have.text', 'Edit settings')
        .and(
          'have.attr',
          'href',
          urls.investments.notificationSettings.estimatedLandDate(
            fixtures.investment.notificationSettingsAll.id
          )
        )
    })
  })
})

describe('Notification settings with no options', () => {
  context('when viewing the "Notifications" page with no settings', () => {
    before(() => {
      cy.setUserFeatures(['notifications'])
      cy.visit(
        urls.investments.notificationSettings.index(
          fixtures.investment.notificationSettingsEmpty.id
        )
      )
    })

    it('should render the header', () => {
      assertLocalHeader('Notification settings')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        'Wig factory': urls.investments.projects.project(
          fixtures.investment.notificationSettingsEmpty.id
        ),
        Notifications: null,
      })
    })

    it('should display the notificaion options', () => {
      cy.get('[data-test="notifications-estimated-land-date"]').should(
        'have.text',
        'None'
      )
    })

    it('should link to individual settings page', () => {
      cy.get('[data-test="notifications-estimated-land-date-link"]')
        .should('have.text', 'Edit settings')
        .and(
          'have.attr',
          'href',
          urls.investments.notificationSettings.estimatedLandDate(
            fixtures.investment.notificationSettingsEmpty.id
          )
        )
    })
  })
})

describe('Notification details option visible', () => {
  context(
    'When viewing a project details page as project manager without feature flag',
    () => {
      before(() => {
        cy.resetUser()
        cy.visit(
          urls.investments.projects.details(
            fixtures.investment.notificationSettingsAll.id
          )
        )
      })
      it('should not display the notifications button', () => {
        cy.get(nav.sideNav).contains('Notifications').should('not.exist')
      })
    }
  )

  context('When viewing a project details page as project manager', () => {
    before(() => {
      cy.setUserFeatures(['notifications'])
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.notificationSettingsAll.id
        )
      )
    })
    it('should display the notifications button', () => {
      cy.get(nav.sideNav).should('contain', 'Notifications')
    })
    it('should render the notifications page when the Notifications tab is clicked', () => {
      cy.get(nav.sideNav).contains('Notifications').click()
      cy.url().should(
        'contain',
        urls.investments.notificationSettings.index(
          fixtures.investment.notificationSettingsAll.id
        )
      )
    })
  })

  context('When viewing a project details page as a user', () => {
    before(() => {
      cy.setUserFeatures(['notifications'])
      cy.visit(
        urls.investments.projects.details(fixtures.investment.newHotelFdi.id)
      )
    })
    it('should not display the notifications button', () => {
      cy.get(nav.sideNav).contains('Notifications').should('not.exist')
    })
  })
})
