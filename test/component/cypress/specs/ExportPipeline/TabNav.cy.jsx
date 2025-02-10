import React from 'react'

import Export from '../../../../../src/client/modules/ExportPipeline/Export'
import { assertBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import { assertTabNav } from '../../../../end-to-end/cypress/support/assertions'
import urls from '../../../../../src/lib/urls'
import fixtures from '../../../../functional/cypress/fixtures'

const exportProjectDetails = fixtures.export.exportProjectDetails

describe('Export project tab navigation', () => {
  it('should render the breadcrumbs for details', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: `/export/${exportProjectDetails.id}/details`,
      tasks: {
        Export: () => exportProjectDetails,
      },
    })
    assertBreadcrumbs({
      Home: urls.exportPipeline.index(),
      [exportProjectDetails.title]: null,
    })
  })

  it('should render the same breadcrumbs for interactions', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: `/export/${exportProjectDetails.id}/interactions/`,
      tasks: {
        Export: () => exportProjectDetails,
      },
    })
    assertBreadcrumbs({
      Home: urls.exportPipeline.index(),
      [exportProjectDetails.title]: null,
    })
  })

  it('should render a company link and page heading', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: `/export/${exportProjectDetails.id}/details`,
      tasks: {
        Export: () => exportProjectDetails,
      },
    })

    cy.get('[data-test=export-company-link]')
      .should('have.text', exportProjectDetails.company.name.toUpperCase())
      .should(
        'have.attr',
        'href',
        `/companies/${exportProjectDetails.company.id}`
      )

    cy.get('[data-test="heading"]').should(
      'have.text',
      exportProjectDetails.title
    )
  })

  it('should render two tabs: Project details and Interactions', () => {
    cy.mountWithProvider(<Export />, {
      initialPath: `/export/${exportProjectDetails.id}/details`,
      tasks: {
        Export: () => Promise.resolve(exportProjectDetails),
        TASK_GET_EXPORT_DETAIL: () => Promise.resolve(exportProjectDetails),
      },
    })
    assertTabNav({
      tabs: ['Project details', 'Interactions'],
      selectedIndex: 0,
    })
  })
})
