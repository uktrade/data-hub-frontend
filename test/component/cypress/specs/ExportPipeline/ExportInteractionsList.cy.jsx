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
      company_export: { id: '987', title: 'Sample export project 987' },
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
        .and('have.attr', 'href', '/export/987/interactions/123/details')

      const itemLabels = '[data-test="metadata-label"]'
      cy.get(itemLabels).should('have.length', 4)
      cy.get(itemLabels).eq(0).should('have.text', 'Date:')
      cy.get(itemLabels).eq(1).should('have.text', 'Contact(s):')
      cy.get(itemLabels).eq(2).should('have.text', 'Adviser(s):')
      cy.get(itemLabels).eq(3).should('have.text', 'Service:')

      const itemValues = '[data-test="metadata-value"]'
      cy.get(itemValues).should('have.length', 4)
      cy.get(itemValues).eq(0).should('have.text', '23 December 2024')
      cy.get(itemValues).eq(1).should('have.text', 'James Brown')
      cy.get(itemValues)
        .eq(2)
        .should('have.text', 'David Buffer - Digital Data Hub - Live Service')
      cy.get(itemValues)
        .eq(3)
        .should('have.text', 'Account management : General')
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
      company_export: { id: '654', title: 'Sample export project 654' },
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

    cy.get('[data-test="metadata-label"]')
      .eq(1)
      .should('have.text', 'Contact(s):')
    cy.get('[data-test="metadata-value"]')
      .eq(1)
      .should('have.text', 'James Brown, Jim Brown, Jude Brown')
  })

  it('should render a list of multiple advisers', () => {
    const interaction = {
      date: '2024-12-23',
      contacts: [],
      company_export: { id: '321', title: 'Sample export project 321' },
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

    cy.get('[data-test="metadata-label"]')
      .eq(2)
      .should('have.text', 'Adviser(s):')
    cy.get('[data-test="metadata-value"]')
      .eq(2)
      .should(
        'have.text',
        'James Brown - British Water, Jim Brown - Cumbria LEP, Jude Brown - Doncaster Council'
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
