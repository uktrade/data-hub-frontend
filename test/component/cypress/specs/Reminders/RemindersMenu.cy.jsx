import React from 'react'
import { RemindersMenu } from '../../../../../src/client/modules/Reminders/RemindersMenu.jsx'
import urls from '../../../../../src/lib/urls'

import DataHubProvider from '../provider'

describe('ContactLocalHeader', () => {
  const Component = (props) => <RemindersMenu {...props} />
  const investmentLinks = [
    {
      title: 'Approaching estimated land dates',
      url: urls.reminders.investments.estimatedLandDate(),
    },
    {
      title: 'Projects with no recent interaction',
      url: urls.reminders.investments.noRecentInteraction(),
    },
    {
      title: 'Outstanding propositions',
      url: urls.reminders.investments.outstandingPropositions(),
    },
  ]

  const exportLinks = [
    {
      title: 'Companies with no recent interaction',
      url: urls.reminders.exports.noRecentInteractions(),
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
      cy.get('@listItems').should('have.length', 3)

      investmentLinks.forEach((item, index) => {
        cy.get('@listItems')
          .eq(index)
          .find('a')
          .should('contain', item.title)
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
          />
        </DataHubProvider>
      )

      cy.get('[data-test="link-list-item"]').as('listItems')
    })

    it('should render all export menu items', () => {
      cy.get('@listItems').should('have.length', 1)

      exportLinks.forEach((item, index) => {
        cy.get('@listItems')
          .eq(index)
          .find('a')
          .should('contain', item.title)
          .should('have.attr', 'href', item.url)
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
            />
          </DataHubProvider>
        )

        cy.get('[data-test="link-list-item"]').as('listItems')
      })

      it('should render all investment menu items', () => {
        cy.get('@listItems').should('have.length', 4)

        investmentLinks.concat(exportLinks).forEach((item, index) => {
          cy.get('@listItems')
            .eq(index)
            .find('a')
            .should('contain', item.title)
            .should('have.attr', 'href', item.url)
        })
      })
    }
  )
})
