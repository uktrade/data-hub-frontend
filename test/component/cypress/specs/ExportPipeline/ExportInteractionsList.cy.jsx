import React from 'react'

import ExportInteractionsList from '../../../../../src/client/modules/ExportPipeline/ExportInteractionsList'
import { interactionFaker } from '../../../../functional/cypress/fakers/interactions'

describe('ExportInteractionsList', () => {
  it('should render a list of export project interactions', () => {
    const exportProject = {
      id: '1',
      title: 'Baileys export to Brazil',
    }

    const interaction = {
      id: 123,
      date: '2024-12-23',
      contacts: [
        {
          name: 'James Brown',
        },
      ],
      dit_participants: [
        {
          adviser: {
            name: 'David Buffer',
          },
          team: {
            name: 'Digital Data Hub - Live Service',
          },
        },
      ],
      service: {
        name: 'Account management : General',
      },
      subject: 'Video call meeting to Baileys',
    }

    const interactionList = [
      interaction,
      interactionFaker(),
      interactionFaker(),
    ]

    cy.mountWithProvider(
      <ExportInteractionsList exportId={exportProject.id} />,
      {
        tasks: {
          Interactions: () => Promise.resolve(interactionList),
          Export: () => Promise.resolve(exportProject),
        },
      }
    )

    cy.get('[data-test="export-interactions-list"]').should('exist')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstItem')

    cy.get('@collectionItems').should('have.length', 3)

    cy.get('@firstItem').within(() => {
      cy.get('h3 a')
        .should('have.text', 'Video call meeting to Baileys')
        .and('have.attr', 'href', '/export/1/interactions/123/details')

      const items = '[data-test="metadata-item"]'
      cy.get(items).should('have.length', 4)
      cy.get(items).eq(0).should('have.text', 'Date: 23 December 2024')
      cy.get(items).eq(1).should('have.text', 'Contact(s): James Brown')
      cy.get(items)
        .eq(2)
        .should(
          'have.text',
          'Adviser(s): David Buffer - Digital Data Hub - Live Service'
        )
      cy.get(items)
        .eq(3)
        .should('have.text', 'Service: Account management : General')
    })
  })

  it('should render a list of multiple contacts', () => {
    const interaction = {
      id: 224,
      date: '2024-12-23',
      contacts: [
        {
          name: 'James Brown',
        },
        {
          name: 'Jim Brown',
        },
        {
          name: 'Jude Brown',
        },
      ],
      dit_participants: [],
      service: {
        name: 'Account management : General',
      },
      subject: 'Video call meeting to Baileys',
    }
    cy.mountWithProvider(<ExportInteractionsList />, {
      tasks: {
        Interactions: () => Promise.resolve([interaction]),
      },
    })

    cy.get('[data-test="metadata-item"]')
      .eq(1)
      .should('have.text', 'Contact(s): James Brown, Jim Brown, Jude Brown')
  })

  it('should render a list of multiple advisers', () => {
    const interaction = {
      date: '2024-12-23',
      contacts: [],
      dit_participants: [
        {
          adviser: {
            name: 'James Brown',
          },
          team: {
            name: 'British Water',
          },
        },
        {
          adviser: {
            name: 'Jim Brown',
          },
          team: {
            name: 'Cumbria LEP',
          },
        },
        {
          adviser: {
            name: 'Jude Brown',
          },
          team: {
            name: 'Doncaster Council',
          },
        },
      ],
      service: {
        name: 'Account management : General',
      },
      subject: 'Send email to Baileys',
    }
    cy.mountWithProvider(<ExportInteractionsList />, {
      tasks: {
        Interactions: () => Promise.resolve([interaction]),
      },
    })

    cy.get('[data-test="metadata-item"]')
      .eq(2)
      .should(
        'have.text',
        'Adviser(s): James Brown - British Water, Jim Brown - Cumbria LEP, Jude Brown - Doncaster Council'
      )
  })

  it('should not render a list of export project interactions', () => {
    cy.mountWithProvider(<ExportInteractionsList />, {
      tasks: {
        Interactions: () => Promise.resolve([]),
      },
    })

    cy.get('[data-test="export-interactions-list"]').should('not.exist')
  })
})
