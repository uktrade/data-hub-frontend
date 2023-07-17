import urls from '../../../../../src/lib/urls'

const assertNotificationBadgeExists = () => {
  cy.get('[data-test="notification-alert-badge"]')
    .should('exist')
    .should('contain', '99+')
}

const assertNotificationBadgeNotExist = () =>
  cy.get('[data-test="notification-alert-badge"]').should('not.exist')

describe('Notification bell', () => {
  after(() => {
    cy.resetUser()
    cy.resetFeatureFlags()
  })

  context('Dashboard', () => {
    it('should display a notification bell when investments are enabled', () => {
      cy.setUserFeatureGroups(['investment-notifications'])
      cy.visit(urls.dashboard())
      assertNotificationBadgeExists()
    })
    it('should display a notification bell when exports are enabled', () => {
      cy.setUserFeatureGroups(['export-notifications'])
      cy.visit(urls.dashboard())
      assertNotificationBadgeExists()
    })
    it('should display a notification bell when both investments and exports are enabled', () => {
      cy.setUserFeatureGroups([
        'investment-notifications',
        'export-notifications',
      ])
      cy.visit(urls.dashboard())
      assertNotificationBadgeExists()
    })
    it('should not display a notification bell when either investments or exports are disabled', () => {
      cy.setUserFeatureGroups([])
      cy.visit(urls.dashboard())
      assertNotificationBadgeNotExist()
    })
  })
  context('Linking to a list of notifications', () => {
    it('should link to "Estimated land date" when both feature groups are set', () => {
      cy.setUserFeatureGroups([
        'investment-notifications',
        'export-notifications',
      ])
      cy.visit(urls.dashboard())
      cy.get('[data-test="notification-alert-badge"]').click()
      cy.url().should('include', urls.reminders.investments.estimatedLandDate())
    })
    it('should link to "Estimated land date" when only "investment-notifications" is set', () => {
      cy.setUserFeatureGroups(['investment-notifications'])
      cy.visit(urls.dashboard())
      cy.get('[data-test="notification-alert-badge"]').click()
      cy.url().should('include', urls.reminders.investments.estimatedLandDate())
    })
    it('should link to "Companies no recent interaction" when only "export-notifications" is set', () => {
      cy.setUserFeatureGroups(['export-notifications'])
      cy.visit(urls.dashboard())
      cy.get('[data-test="notification-alert-badge"]').click()
      cy.url().should('include', urls.reminders.exports.noRecentInteractions())
    })
  })
})
