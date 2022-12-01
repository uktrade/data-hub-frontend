import urls from '../../../../../../src/lib/urls'

const selectors = {
  collectionItem: '[data-test="item-content"]',
  remindersSettings: 'a[data-test="reminders-settings-link"]',
  ELDSettingsClose: '#estimated-land-dates-toggle-toggle-button-close',
  ELDSettingsOpen: '#estimated-land-dates-toggle-toggle-button-open',
  ELDEdit: '[data-test="estimated-land-dates-link"]',
  NRISettingsClose: '#no-recent-interactions-toggle-toggle-button-close',
  NRISettingsOpen: '#no-recent-interactions-toggle-toggle-button-open',
  NRIEdit: '[data-test="no-recent-interactions-link"]',
}

describe('Notification settings', () => {
  context('when in estimated land date page', () => {
    before(() => {
      cy.visit(urls.reminders.investments.estimatedLandDate())
      cy.get(selectors.collectionItem).should('be.visible')
      cy.get(selectors.remindersSettings).eq(1).should('be.visible').click()
    })

    it('should have approaching estimated land date settings expanded', () => {
      cy.get(selectors.ELDSettingsClose).should('be.visible')
    })

    it('should have no recent interaction settings collapsed', () => {
      cy.get(selectors.NRISettingsOpen).should('be.visible')
    })

    it('should have approaching estimated land date settings expanded after edit', () => {
      cy.get(selectors.ELDEdit).click()
      cy.contains('Save').click()

      cy.contains('Settings updated').should('be.visible')
      cy.get(selectors.ELDSettingsClose).should('be.visible')
    })
  })

  context('when in no recent interaction page', () => {
    beforeEach(() => {
      cy.visit(urls.reminders.investments.noRecentInteraction())
      cy.contains('days since last interaction').should('be.visible')
      cy.get(selectors.remindersSettings).eq(1).should('be.visible').click()
    })

    it('should have no recent interaction settings expanded', () => {
      cy.get(selectors.NRISettingsClose).should('be.visible')
    })

    it('should have approaching estimated land date settings collapsed', () => {
      cy.get(selectors.ELDSettingsOpen).should('be.visible')
    })

    it('should have no recent interaction settings expanded after edit', () => {
      cy.get(selectors.NRIEdit).click()
      cy.contains('Save').click()

      cy.contains('Settings updated').should('be.visible')
      cy.get(selectors.NRISettingsClose).should('be.visible')
    })
  })
})
