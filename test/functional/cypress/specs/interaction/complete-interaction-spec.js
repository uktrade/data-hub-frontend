const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Complete interaction', () => {
  let params = {}

  before(() => {
    params.companyId = fixtures.company.venusLtd.id
    params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

    cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

    cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()
  })

  it('should render breadcrumbs', () => {
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
    cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
    cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
    cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
    cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', fixtures.company.venusLtd.name)
    cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${fixtures.company.venusLtd.id}`)
    cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.text', 'Interactions')
    cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.attr', 'href', `/companies/${fixtures.company.venusLtd.id}/interactions`)
    cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Interaction')
  })

  it('should render the heading', () => {
    cy.get(selectors.localHeader().heading).should('have.text', 'Did the meeting take place?')
  })

  it('should render the form', () => {
    cy.get(selectors.interaction.complete.meetingHappen.yes).should('be.visible')
    cy.get(selectors.interaction.complete.meetingHappen.no).should('be.visible')
    cy.get(selectors.interaction.complete.archivedReason.clientCancelled).should('not.be.visible')
    cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should('not.be.visible')
    cy.get(selectors.interaction.complete.archivedReason.rescheduled).should('not.be.visible')
    cy.get(selectors.interaction.complete.rescheduledDate).should('not.be.visible')
    cy.get(selectors.interaction.complete.actions.continue).should('be.visible')
    cy.get(selectors.interaction.complete.actions.back(params)).should('be.visible')
  })

  it('should toggle field visibility in the form', () => {
    cy.get(selectors.interaction.complete.meetingHappen.no).click()
    cy.get(selectors.interaction.complete.archivedReason.clientCancelled).should('be.visible')
    cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should('be.visible')
    cy.get(selectors.interaction.complete.archivedReason.rescheduled).should('be.visible')
    cy.get(selectors.interaction.complete.rescheduledDate).should('not.be.visible')

    cy.get(selectors.interaction.complete.archivedReason.rescheduled).click()
    cy.get(selectors.interaction.complete.rescheduledDate).should('be.visible')

    cy.get(selectors.interaction.complete.archivedReason.clientCancelled).click()
    cy.get(selectors.interaction.complete.rescheduledDate).should('not.be.visible')

    cy.get(selectors.interaction.complete.meetingHappen.yes).click()
    cy.get(selectors.interaction.complete.archivedReason.clientCancelled).should('not.be.visible')
    cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should('not.be.visible')
    cy.get(selectors.interaction.complete.archivedReason.rescheduled).should('not.be.visible')
    cy.get(selectors.interaction.complete.rescheduledDate).should('not.be.visible')
  })
})
