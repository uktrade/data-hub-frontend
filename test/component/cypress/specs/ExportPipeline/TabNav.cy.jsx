import React from 'react'

import ExportTabNav from '../../../../../src/client/modules/ExportPipeline/ExportTabNav'
import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertLocalNav } from '../../../../end-to-end/cypress/support/assertions'
import urls from '../../../../../src/lib/urls'

const exportProject = {
  id: '1',
  title: 'Rolls Royce to UAE',
  company: {
    id: '2',
    name: 'Rolls Royce',
  },
}

describe('Export project tab navigation', () => {
  it('should render the breadcrumbs for details', () => {
    cy.mountWithProvider(<ExportTabNav />, {
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
    cy.mountWithProvider(<ExportTabNav />, {
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
    cy.mountWithProvider(<ExportTabNav />, {
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
    cy.mountWithProvider(<ExportTabNav />)
    cy.get('[role="tablist"]').should('exist')
    cy.get('[role="tab"]').as('tabItems')
    assertLocalNav('@tabItems', ['Project details', 'Interactions'])
  })
})
