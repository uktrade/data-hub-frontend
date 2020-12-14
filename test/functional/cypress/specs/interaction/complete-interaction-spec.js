const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')

const companyLocalHeader = selectors.companyLocalHeader()

describe('Complete interaction', () => {
  context('Render form', () => {
    const params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.draftPastMeeting.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )

      cy.get(
        selectors.interaction.details.interaction.actions.completeInteraction(
          params
        )
      ).click()
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Companies: '/companies',
        [fixtures.company.venusLtd
          .name]: `/companies/${fixtures.company.venusLtd.id}`,
        Interactions: `/companies/${fixtures.company.venusLtd.id}/interactions`,
        Interaction: null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'Did the meeting take place?'
      )
    })

    it('should render the form', () => {
      cy.get(selectors.interaction.complete.meetingHappen.yes).should(
        'be.visible'
      )
      cy.get(selectors.interaction.complete.meetingHappen.no).should(
        'be.visible'
      )
      cy.get(
        selectors.interaction.complete.archivedReason.clientCancelled
      ).should('not.exist')
      cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should(
        'not.exist'
      )
      cy.get(selectors.interaction.complete.archivedReason.rescheduled).should(
        'not.exist'
      )
      cy.get(selectors.interaction.complete.rescheduledDate.field).should(
        'not.exist'
      )
      cy.get(selectors.interaction.complete.actions.continue).should(
        'be.visible'
      )
      cy.get(selectors.interaction.complete.actions.back(params)).should(
        'be.visible'
      )
    })

    it('should toggle field visibility in the form', () => {
      cy.get(selectors.interaction.complete.meetingHappen.no).click()
      cy.get(
        selectors.interaction.complete.archivedReason.clientCancelled
      ).should('be.visible')
      cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should(
        'be.visible'
      )
      cy.get(selectors.interaction.complete.archivedReason.rescheduled).should(
        'be.visible'
      )
      cy.get(selectors.interaction.complete.rescheduledDate.field).should(
        'not.exist'
      )

      cy.get(selectors.interaction.complete.archivedReason.rescheduled).click()
      cy.get(selectors.interaction.complete.rescheduledDate.field).should(
        'be.visible'
      )

      cy.get(
        selectors.interaction.complete.archivedReason.clientCancelled
      ).click()
      cy.get(selectors.interaction.complete.rescheduledDate.field).should(
        'not.exist'
      )

      cy.get(selectors.interaction.complete.meetingHappen.yes).click()
      cy.get(
        selectors.interaction.complete.archivedReason.clientCancelled
      ).should('not.exist')
      cy.get(selectors.interaction.complete.archivedReason.ditCancelled).should(
        'not.exist'
      )
      cy.get(selectors.interaction.complete.archivedReason.rescheduled).should(
        'not.exist'
      )
      cy.get(selectors.interaction.complete.rescheduledDate.field).should(
        'not.exist'
      )
    })
  })

  context('Submit form', () => {
    context('when no options are selected', () => {
      const params = {}

      before(() => {
        params.companyId = fixtures.company.venusLtd.id
        params.interactionId = fixtures.interaction.draftPastMeeting.id

        cy.visit(
          `/companies/${params.companyId}/interactions/${params.interactionId}`
        )

        cy.get(
          selectors.interaction.details.interaction.actions.completeInteraction(
            params
          )
        ).click()

        cy.get(selectors.interaction.complete.actions.continue).click()
      })

      it('should not redirect to the interaction list', () => {
        cy.location('pathname').should(
          'eq',
          `/companies/${params.companyId}/interactions/${params.interactionId}/complete`
        )
      })

      it('should show an error', () => {
        cy.get(selectors.interaction.complete.meetingHappen.error).should(
          'be.visible'
        )
        cy.get(selectors.interaction.complete.meetingHappen.error).should(
          'have.text',
          'You must select an option'
        )
      })
    })

    context('when the meeting did not happen', () => {
      context('no reason selected', () => {
        const params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.draftPastMeeting.id

          cy.visit(
            `/companies/${params.companyId}/interactions/${params.interactionId}`
          )

          cy.get(
            selectors.interaction.details.interaction.actions.completeInteraction(
              params
            )
          ).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should not redirect to the interaction list', () => {
          cy.location('pathname').should(
            'eq',
            `/companies/${params.companyId}/interactions/${params.interactionId}/complete`
          )
        })

        it('should show an error', () => {
          cy.get(selectors.interaction.complete.archivedReason.error).should(
            'be.visible'
          )
          cy.get(selectors.interaction.complete.archivedReason.error).should(
            'have.text',
            'You must select an option'
          )
        })
      })

      context('and client cancelled', () => {
        const params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.draftPastMeeting.id

          cy.visit(
            `/companies/${params.companyId}/interactions/${params.interactionId}`
          )

          cy.get(
            selectors.interaction.details.interaction.actions.completeInteraction(
              params
            )
          ).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(
            selectors.interaction.complete.archivedReason.clientCancelled
          ).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should redirect to the company activity', () => {
          cy.location('pathname').should(
            'eq',
            `/companies/${params.companyId}/activity`
          )
        })

        it('should show the success message', () => {
          cy.get(companyLocalHeader.flashMessageList).contains(
            'The interaction has been updated'
          )
        })

        // todo assert interaction changed state
      })

      context('and DIT cancelled', () => {
        const params = {}

        before(() => {
          params.companyId = fixtures.company.venusLtd.id
          params.interactionId = fixtures.interaction.draftPastMeeting.id

          cy.visit(
            `/companies/${params.companyId}/interactions/${params.interactionId}`
          )

          cy.get(
            selectors.interaction.details.interaction.actions.completeInteraction(
              params
            )
          ).click()

          cy.get(selectors.interaction.complete.meetingHappen.no).click()
          cy.get(
            selectors.interaction.complete.archivedReason.ditCancelled
          ).click()
          cy.get(selectors.interaction.complete.actions.continue).click()
        })

        it('should redirect to the company activity', () => {
          cy.location('pathname').should(
            'eq',
            `/companies/${params.companyId}/activity`
          )
        })

        it('should show the success message', () => {
          cy.get(companyLocalHeader.flashMessageList).contains(
            'The interaction has been updated'
          )
        })

        // todo assert interaction changed state
      })

      context('and rescheduled', () => {
        context('and a valid date is not entered', () => {
          const params = {}

          before(() => {
            params.companyId = fixtures.company.venusLtd.id
            params.interactionId = fixtures.interaction.draftPastMeeting.id

            cy.visit(
              `/companies/${params.companyId}/interactions/${params.interactionId}`
            )

            cy.get(
              selectors.interaction.details.interaction.actions.completeInteraction(
                params
              )
            ).click()

            cy.get(selectors.interaction.complete.meetingHappen.no).click()
            cy.get(
              selectors.interaction.complete.archivedReason.rescheduled
            ).click()
            cy.get(selectors.interaction.complete.actions.continue).click()
          })

          it('should not redirect to the interaction list', () => {
            cy.location('pathname').should(
              'eq',
              `/companies/${params.companyId}/interactions/${params.interactionId}/complete`
            )
          })

          it('should show an error', () => {
            cy.get(selectors.interaction.complete.rescheduledDate.error).should(
              'be.visible'
            )
            cy.get(selectors.interaction.complete.rescheduledDate.error).should(
              'have.text',
              'You must enter a date'
            )
          })
        })

        context('and a valid date is entered', () => {
          const params = {}

          before(() => {
            params.companyId = fixtures.company.venusLtd.id
            params.interactionId = fixtures.interaction.draftPastMeeting.id

            cy.visit(
              `/companies/${params.companyId}/interactions/${params.interactionId}`
            )

            cy.get(
              selectors.interaction.details.interaction.actions.completeInteraction(
                params
              )
            ).click()

            cy.get(selectors.interaction.complete.meetingHappen.no).click()
            cy.get(
              selectors.interaction.complete.archivedReason.rescheduled
            ).click()
            cy.get(selectors.interaction.complete.rescheduledDate.field).type(
              '2030-01-01'
            )
            cy.get(selectors.interaction.complete.actions.continue).click()
          })

          it('should redirect to the company activity', () => {
            cy.location('pathname').should(
              'eq',
              `/companies/${params.companyId}/activity`
            )
          })

          it('should show the success message', () => {
            cy.get(companyLocalHeader.flashMessageList).contains(
              'The interaction has been updated'
            )
          })

          // todo assert interaction changed state
        })
      })
    })

    context('when the meeting did happen', () => {
      const params = {}

      before(() => {
        params.companyId = fixtures.company.venusLtd.id
        params.interactionId = fixtures.interaction.draftPastMeeting.id

        cy.visit(
          `/companies/${params.companyId}/interactions/${params.interactionId}`
        )

        cy.get(
          selectors.interaction.details.interaction.actions.completeInteraction(
            params
          )
        ).click()

        cy.get(selectors.interaction.complete.meetingHappen.yes).click()
        cy.get(selectors.interaction.complete.actions.continue).click()
      })

      it('should redirect to the interaction create form', () => {
        cy.contains('h1', 'Edit interaction for Venus Ltd')
        cy.location('pathname').should(
          'eq',
          `/companies/${params.companyId}/interactions/${[
            params.interactionId,
          ]}/edit`
        )
      })
    })
  })
})
