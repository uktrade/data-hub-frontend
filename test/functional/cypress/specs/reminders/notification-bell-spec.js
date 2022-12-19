import urls from '../../../../../src/lib/urls'

const assertNotificationBadgeExists = () => {
  cy.get('[data-test="notification-alert-badge"]')
    .should('exist')
    .should('contain', '289')
}

const assertNotificationBadgeNotExist = () =>
  cy.get('[data-test="notification-alert-badge"]').should('not.exist')

describe('Notification bell', () => {
  context('Dashboard', () => {
    beforeEach(() => {
      cy.setUserFeatures(['personalised-dashboard'])
    })
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
})
