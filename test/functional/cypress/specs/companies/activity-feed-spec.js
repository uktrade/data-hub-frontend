const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Company activity feed', () => {
  const commonTests = ({
    expectedHeading,
    expectedAddress,
    expectedCompanyId,
    expectedActivitiesHeading,
  }) => {
    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Activity Feed')
    })

    it('should display the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', expectedHeading)
    })

    it('should display the address', () => {
      cy.get(selectors.localHeader().headingAfter).should('have.text', expectedAddress)
    })

    it('should display the "View full business details" link', () => {
      const selector = selectors.localHeader().viewFullBusinessDetailsLink(expectedCompanyId)
      cy.get(selector).should('have.text', 'View full business details')
    })

    it('should display the local nav', () => {
      cy.get(selectors.tabbedLocalNav().item(1)).should('have.text', 'Activity')
      cy.get(selectors.tabbedLocalNav().item(2)).should('have.text', 'Company contacts')
      cy.get(selectors.tabbedLocalNav().item(3)).should('have.text', 'Core team')
      cy.get(selectors.tabbedLocalNav().item(4)).should('have.text', 'Investment')
      cy.get(selectors.tabbedLocalNav().item(5)).should('have.text', 'Export')
      cy.get(selectors.tabbedLocalNav().item(6)).should('have.text', 'Orders')
    })

    it('should not display the pending D&B investigation message', () => {
      cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should('not.be.visible')
    })

    it('should display the "Activities" heading', () => {
      cy.get(selectors.companyCollection().heading).should('have.text', expectedActivitiesHeading)
    })
  }

  context('when viewing Venus Ltd which has no activities', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/activity`)
    })

    commonTests({
      expectedHeading: fixtures.company.venusLtd.name,
      expectedAddress: '66 Marcham Road, Bordley, BD23 8RZ, United Kingdom',
      expectedCompanyId: fixtures.company.venusLtd.id,
      expectedActivitiesHeading: 'Activities',
    })

    it('should display "Add interaction" button', () => {
      cy.get(selectors.companyCollection().interaction.addButton(fixtures.company.venusLtd.id)).should('have.text', 'Add interaction')
    })

    it('should not display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should('not.be.visible')
    })

    it('should display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should('be.visible')
    })
  })

  context('when viewing activity feed for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/activity`)
    })

    commonTests({
      expectedHeading: fixtures.company.archivedLtd.name,
      expectedAddress: '16 Getabergsvagen, Geta, 22340, Malta',
      expectedCompanyId: fixtures.company.archivedLtd.id,
      expectedActivitiesHeading: '1 activity',
    })

    it('should display the badge', () => {
      cy.get(selectors.localHeader().badge(1)).should('have.text', 'Global HQ')
    })

    it('should display the One List tier', () => {
      const expected = 'This is an account managed company (One List Tier A - Strategic Account)'
      cy.get(selectors.localHeader().description.paragraph(1)).should('have.text', expected)
    })

    it('should display the Global Account Manager', () => {
      const expected = 'Global Account Manager: Travis Greene View core team'
      cy.get(selectors.localHeader().description.paragraph(2)).should('have.text', expected)
    })

    it('should not display the "Add interaction" button', () => {
      cy.get(selectors.companyCollection().interaction.addButton(fixtures.company.archivedLtd.id)).should('not.exist')
    })

    it('should display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should('be.visible')
    })

    it('should not display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should('not.be.visible')
    })
  })
})
