import React from 'react'

import { CompanyExportWinsList } from '../../../../../../src/client/modules/Companies/CompanyExports/ExportWins'
import { companyExportWinFaker } from '../../../../../../test/functional/cypress/fakers/company-export-win'
import { createTestProvider } from '../../provider'

describe('CompanyExportWins', () => {
  const companyExportWin = companyExportWinFaker()

  it('should conditionally render tags', () => {
    const createProvider = (exportWinsList) =>
      createTestProvider({
        'Export Wins': () => Promise.resolve(exportWinsList),
        Company: () => Promise.resolve({ id: 123 }),
        TASK_GET_REMINDER_SUMMARY: () => Promise.resolve(),
      })

    ;[
      // The lead_officer id doesn't match the currentAdviserId
      {
        exportWins: [
          {
            ...companyExportWin,
            lead_officer: {
              id: '2',
            },
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: false,
      },
      {
        // The lead_officer id matches the currentAdviserId
        exportWins: [
          {
            ...companyExportWin,
            lead_officer: {
              id: '1',
            },
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: true,
        role: 'Role: lead officer',
      },
      {
        // The lead_officer field will be null if the export win has been migrated to
        // Data Hub and doesn't match a Data Hub adviser.
        exportWins: [
          {
            ...companyExportWin,
            lead_officer: null,
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: false,
      },
      // The team_members array doesn't include the currentAdviserId
      {
        exportWins: [
          {
            ...companyExportWin,
            team_members: [
              {
                id: '1',
              },
              {
                id: '2',
              },
              {
                id: '3',
              },
            ],
          },
        ],
        currentAdviserId: '4',
        shouldRenderTag: false,
      },
      {
        // The team_members array includes the currentAdviserId
        exportWins: [
          {
            ...companyExportWin,
            team_members: [
              {
                id: '1',
              },
              {
                id: '2',
              },
              {
                id: '3',
              },
            ],
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: true,
        role: 'Role: team member',
      },
      {
        // The teamMembers array will always be empty for export wins that have been
        // migrated to Data Hub.
        exportWins: [
          {
            ...companyExportWin,
            team_members: [],
          },
        ],
        currentAdviserId: '4',
        shouldRenderTag: false,
      },
      // The contributing_advisers array doesn't include the currentAdviserId
      {
        exportWins: [
          {
            ...companyExportWin,
            contributing_advisers: [
              {
                adviser: {
                  id: '1',
                },
              },
              {
                adviser: {
                  id: '2',
                },
              },
              {
                adviser: {
                  id: '3',
                },
              },
            ],
          },
        ],
        currentAdviserId: '4',
        shouldRenderTag: false,
      },
      {
        // The contributing_advisers array includes the currentAdviserId
        exportWins: [
          {
            ...companyExportWin,
            contributing_advisers: [
              {
                adviser: {
                  id: '1',
                },
              },
              {
                adviser: {
                  id: '2',
                },
              },
              {
                adviser: {
                  id: '3',
                },
              },
            ],
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: true,
        role: 'Role: contributing officer',
      },
      {
        // The adviser field within a contributing adviser object will always
        // be null if the export win has been migrated to Data Hub and doesn't
        // match a Data Hub adviser.
        exportWins: [
          {
            ...companyExportWin,
            contributing_advisers: [
              {
                adviser: null,
              },
              {
                adviser: null,
              },
              {
                adviser: null,
              },
            ],
          },
        ],
        currentAdviserId: '1',
        shouldRenderTag: false,
      },
    ].forEach(({ exportWins, currentAdviserId, shouldRenderTag, role }) => {
      const Provider = createProvider(exportWins)
      cy.mount(
        <Provider>
          <CompanyExportWinsList
            exportWins={exportWins}
            currentAdviserId={currentAdviserId}
          />
        </Provider>
      )

      const assertion = shouldRenderTag ? 'exist' : 'not.exist'
      cy.get('[data-test="collection-item-tags"]').should(assertion)
      if (assertion === 'exist') {
        cy.get('[data-test="collection-item-tag"]').should('have.text', role)
      }
    })
  })
})
