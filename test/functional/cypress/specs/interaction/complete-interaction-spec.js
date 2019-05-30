const fixtures = require('../../fixtures')
const selectors = require('../../selectors')

describe('Complete interaction', () => {
  context('Render form', () => {
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
      cy.get(selectors.interaction.complete.rescheduledDate.field).should('not.be.visible')
      cy.get(selectors.interaction.complete.actions.continue).should('be.visible')
      cy.get(selectors.interaction.complete.actions.back(params)).should('be.visible')
    })

    it('should toggle field visibility in the form', () => {
      cy.get(selectors.interaction.complete.meetingHappen.no).click()
      cy.get(selectors.interaction.complete.archivedReason.clientCancelled).should('be.visible')
      cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should('be.visible')
      cy.get(selectors.interaction.complete.archivedReason.rescheduled).should('be.visible')
      cy.get(selectors.interaction.complete.rescheduledDate.field).should('not.be.visible')

      cy.get(selectors.interaction.complete.archivedReason.rescheduled).click()
      cy.get(selectors.interaction.complete.rescheduledDate.field).should('be.visible')

      cy.get(selectors.interaction.complete.archivedReason.clientCancelled).click()
      cy.get(selectors.interaction.complete.rescheduledDate.field).should('not.be.visible')

      cy.get(selectors.interaction.complete.meetingHappen.yes).click()
      cy.get(selectors.interaction.complete.archivedReason.clientCancelled).should('not.be.visible')
      cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should('not.be.visible')
      cy.get(selectors.interaction.complete.archivedReason.rescheduled).should('not.be.visible')
      cy.get(selectors.interaction.complete.rescheduledDate.field).should('not.be.visible')
    })
  })

  context('Submit form', () => {
    context('when no options are selected', () => {
      let params = {}

      before(() => {
        params.companyId = fixtures.company.venusLtd.id
        params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

        cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

        cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

        cy.get(selectors.interaction.complete.actions.continue).click()
      })

      it('should not redirect to the interaction list', () => {
        cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions/${params.interactionId}/complete`)
      })

      it('should show an error', () => {
        cy.get(selectors.interaction.complete.meetingHappen.error).should('be.visible')
        cy.get(selectors.interaction.complete.meetingHappen.error).should('have.text', 'You must select an option')
      })
    })

    context('when the meeting did not happen', () => {
      context('no reason selected', () => {
        let params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

          cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

          cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should not redirect to the interaction list', () => {
          cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions/${params.interactionId}/complete`)
        })

        it('should show an error', () => {
          cy.get(selectors.interaction.complete.archivedReason.error).should('be.visible')
          cy.get(selectors.interaction.complete.archivedReason.error).should('have.text', 'You must select an option')
        })
      })

      context('and client cancelled', () => {
        let params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

          cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

          cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(selectors.interaction.complete.archivedReason.clientCancelled).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should redirect to the interaction list', () => {
          cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions`)
        })

        it('should show the success message', () => {
          cy.get(selectors.localHeader().flash).should('contain', 'The interaction has been updated')
          cy.get(selectors.localHeader().flash).should('have.class', 'c-message--success')
        })

        // todo assert interaction changed state
      })

      context('and DIT cancelled', () => {
        let params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

          cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

          cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(selectors.interaction.complete.archivedReason.ditCancelled).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should redirect to the interaction list', () => {
          cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions`)
        })

        it('should show the success message', () => {
          cy.get(selectors.localHeader().flash).should('contain', 'The interaction has been updated')
          cy.get(selectors.localHeader().flash).should('have.class', 'c-message--success')
        })

        // todo assert interaction changed state
      })

      context('and rescheduled', () => {
        context('and a valid date is not entered', () => {
          let params = {}

          before(() => {
            params.companyId = fixtures.company.venusLtd.id
            params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

            cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

            cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

            cy.get(selectors.interaction.complete.meetingHappen.no).click()
            cy.get(selectors.interaction.complete.archivedReason.rescheduled).click()
            cy.get(selectors.interaction.complete.actions.continue).click()
          })

          it('should not redirect to the interaction list', () => {
            cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions/${params.interactionId}/complete`)
          })

          it('should show an error', () => {
            cy.get(selectors.interaction.complete.rescheduledDate.error).should('be.visible')
            cy.get(selectors.interaction.complete.rescheduledDate.error).should('have.text', 'You must enter a date')
          })
        })

        context('and a valid date is entered', () => {
          let params = {}

          before(() => {
            params.companyId = fixtures.company.venusLtd.id
            params.interactionId = fixtures.interaction.interactionDraftPastMeeting.id

            cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)

            cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).click()

            cy.get(selectors.interaction.complete.meetingHappen.no).click()
            cy.get(selectors.interaction.complete.archivedReason.rescheduled).click()
            cy.get(selectors.interaction.complete.rescheduledDate.field).type('2030-01-01')
            cy.get(selectors.interaction.complete.actions.continue).click()
          })

          it('should redirect to the interaction list', () => {
            cy.location('pathname').should('eq', `/companies/${params.companyId}/interactions`)
          })

          it('should show the success message', () => {
            cy.get(selectors.localHeader().flash).should('contain', 'The interaction has been updated')
            cy.get(selectors.localHeader().flash).should('have.class', 'c-message--success')
          })

          // todo assert interaction changed state
        })
      })
    })
  })
})
