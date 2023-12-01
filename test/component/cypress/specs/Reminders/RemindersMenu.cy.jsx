import React from 'react'

import { RemindersMenu } from '../../../../../src/client/modules/Reminders/RemindersMenu.jsx'
import urls from '../../../../../src/lib/urls'

import DataHubProvider from '../provider'

describe('RemindersMenu', () => {
  const Component = (props) => (
    <RemindersMenu
      reminderSummary={{
        count: 10,
        investment: {
          estimated_land_date: 1,
          no_recent_interaction: 2,
          outstanding_propositions: 3,
        },
        export: {
          no_recent_interaction: 4,
          new_interaction: 8,
        },
        my_tasks: {
          due_date_approaching: 5,
          task_assigned_to_me_from_others: 4,
          task_amendments_by_others: 3,
          task_overdue: 6,
          task_completed: 7,
        },
      }}
      {...props}
    />
  )
  const investmentLinks = [
    {
      title: 'Approaching estimated land dates (1)',
      url: urls.reminders.investments.estimatedLandDate(),
    },
    {
      title: 'Projects with no recent interactions (2)',
      url: urls.reminders.investments.noRecentInteraction(),
    },
    {
      title: 'Outstanding propositions (3)',
      url: urls.reminders.investments.outstandingPropositions(),
    },
  ]

  const exportLinks = [
    {
      title: 'Companies with no recent interactions (4)',
      url: urls.reminders.exports.noRecentInteractions(),
    },
    {
      title: 'Companies with new interactions (8)',
      url: urls.reminders.exports.newInteractions(),
    },
  ]

  const myTasksLinks = [
    {
      title: 'Due date approaching (5)',
      url: urls.reminders.myTasks.dueDateApproaching(),
    },
    {
      title: 'Task assigned to me from others (4)',
      url: urls.reminders.myTasks.taskAssignedToMeFromOthers(),
    },
    {
      title: 'Task amendments by others (3)',
      url: urls.reminders.myTasks.taskAmendmentsByOthers(),
    },
    {
      title: 'Task overdue (6)',
      url: urls.reminders.myTasks.taskOverdue(),
    },
    {
      title: 'Task completed (7)',
      url: urls.reminders.myTasks.taskCompleted(),
    },
  ]

  context('When hasInvestmentFeatureGroup is true', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={true}
            hasExportFeatureGroup={false}
          />
        </DataHubProvider>
      )

      cy.get('[data-test="link-list-item"]').as('listItems')
    })

    it('should render all investment menu items', () => {
      cy.get('@listItems').should('have.length', 8)

      investmentLinks.forEach((item, index) => {
        cy.get('@listItems')
          .eq(index)
          .find('a')
          .should('have.text', item.title)
          .should('have.attr', 'href', item.url)
      })
    })
  })

  context('When hasExportFeatureGroup is true', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={false}
            hasExportFeatureGroup={true}
            hasExportNewInteractionReminders={true}
          />
        </DataHubProvider>
      )

      cy.get('[data-test="link-list-item"]').as('listItems')
    })

    it('should render all export menu items', () => {
      cy.get('@listItems').should('have.length', 7)

      exportLinks.forEach((item, index) => {
        cy.get('@listItems')
          .eq(index)
          .find('a')
          .should('have.text', item.title)
          .should('have.attr', 'href', item.url)
      })
    })

    context('and hasExportNewInteractionReminders is false', () => {
      beforeEach(() => {
        cy.mount(
          <DataHubProvider>
            <Component
              hasInvestmentFeatureGroup={false}
              hasExportFeatureGroup={true}
              hasExportNewInteractionReminders={false}
            />
          </DataHubProvider>
        )

        cy.get('[data-test="link-list-item"]').as('listItems')
      })

      it('should not render Companies with new interactions', () => {
        cy.get('@listItems').should('have.length', 6)

        cy.get('@listItems')
          .eq(0)
          .find('a')
          .should('have.text', exportLinks[0].title)
          .should('have.attr', 'href', exportLinks[0].url)
      })
    })
  })

  context(
    'When hasInvestmentFeatureGroup and hasExportFeatureGroup is true',
    () => {
      beforeEach(() => {
        cy.mount(
          <DataHubProvider>
            <Component
              hasInvestmentFeatureGroup={true}
              hasExportFeatureGroup={true}
              hasExportNewInteractionReminders={true}
            />
          </DataHubProvider>
        )

        cy.get('[data-test="link-list-item"]').as('listItems')
      })

      it('should render all menu items', () => {
        cy.get('@listItems').should('have.length', 10)

        investmentLinks
          .concat(exportLinks)
          .concat(myTasksLinks)
          .forEach((item, index) => {
            cy.get('@listItems')
              .eq(index)
              .find('a')
              .should('have.text', item.title)
              .should('have.attr', 'href', item.url)
          })
      })
    }
  )

  context('When only My Tasks is displayed', () => {
    beforeEach(() => {
      cy.mount(
        <DataHubProvider>
          <Component
            hasInvestmentFeatureGroup={false}
            hasExportFeatureGroup={false}
          />
        </DataHubProvider>
      )

      cy.get('[data-test="link-list-item"]').as('listItems')
    })

    it('should render all my tasks menu items', () => {
      cy.get('@listItems').should('have.length', 5)

      myTasksLinks.forEach((item, index) => {
        cy.get('@listItems')
          .eq(index)
          .find('a')
          .should('have.text', item.title)
          .should('have.attr', 'href', item.url)
      })
    })
  })
})
