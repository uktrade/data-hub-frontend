import React from 'react'

import Export from '../../../../../src/client/modules/ExportPipeline/Export'
import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertTabNav } from '../../../../end-to-end/cypress/support/assertions'
import urls from '../../../../../src/lib/urls'

const exportProject = {
  id: '1',
  title: 'Rolls Royce to UAE',
  company: {
    id: '2',
    name: 'Rolls Royce',
  },
  team_members: [
    {
      name: 'David Jones',
      id: '1',
    },
  ],
  contacts: [
    {
      name: 'Johan Person',
      email: 'johan@nederlands.com',
      id: '1',
    },
  ],
}

describe('Export project tab navigation', () => {
  it('should render the breadcrumbs for details', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: '/export/1/details',
      tasks: {
        Export: () => exportProject,
      },
    })
    assertBreadcrumbs({
      Home: urls.exportPipeline.index(),
      [exportProject.title]: null,
    })
  })

  it('should render the same breadcrumbs for interactions', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: '/export/1/interactions/',
      tasks: {
        Export: () => exportProject,
      },
    })
    assertBreadcrumbs({
      Home: urls.exportPipeline.index(),
      [exportProject.title]: null,
    })
  })

  it('should render a company link and page heading', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: '/export/1/details',
      tasks: {
        Export: () => exportProject,
      },
    })

    cy.get('[data-test=export-company-link]')
      .should('have.text', exportProject.company.name.toUpperCase())
      .should('have.attr', 'href', `/companies/${exportProject.company.id}`)

    cy.get('[data-test="heading"]').should('have.text', 'Rolls Royce to UAE')
  })

  it('should render two tabs: Project details and Interactions', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: '/export/1/details',
      tasks: {
        Export: () => Promise.resolve(exportProject),
        TASK_GET_EXPORT_DETAIL: () => Promise.resolve(exportProject),
      },
    })
    assertTabNav({
      tabs: ['Project details', 'Interactions'],
      selectedIndex: 0,
    })
  })
})
