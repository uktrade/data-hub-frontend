/* eslint-disable prettier/prettier */
import React from 'react'

import WinsPendingList from '../../../../../src/client/modules/ExportWins/Status/WinsPendingList'
import WinsConfirmedTable from '../../../../../src/client/modules/ExportWins/Status/WinsConfirmedTable'

const EXPORT_WIN = {
  id: 'export-win-id',
  name_of_export: 'Rubber chicken',
  lead_officer: {
    name: 'Leo Jacobs',
  },
  country: {
    name: 'Australia',
  },
  comments: 'Lorem ipsum dolor sit amet',
  total_expected_export_value: 2528571,
  date: '2024-03-26T14:29:01.521Z',
  goods_vs_services: {
    name: 'Services',
  },
  is_personally_confirmed: false,
  description: 'Lorem ipsum dolor sit amet',
  export_experience: {
    name: 'My export experience',
  },
  breakdowns: [
    {
      type: {
        name: 'Export',
      },
      value: 123456,
      year: 3,
    },
  ],
}

;[
  ['WinsPendingList', WinsPendingList],
  ['WinsConfirmedTable', WinsConfirmedTable],
].forEach(([name, Component]) =>
  describe(name, () => {
    it('Sorting should work as expected', () => {
      const stub = cy.stub()

      const expectTaskToBeCalledWithSortby = expectedSortby =>
        expect(stub.lastCall.args[0].sortby).to.eq(expectedSortby) 

      cy.mountWithProvider(<Component />, {
        tasks: {
          'Export Wins': (payload) => {
            stub(payload)
            return Promise.resolve({
              count: 1,
              items: [EXPORT_WIN],
            })
          },
        },
      })
      .then(() => {
        expectTaskToBeCalledWithSortby('-created_on')
      })

      cy.contains('label', 'Sort by')
        .within(() => {
          cy.get('select option:selected')
            .should('have.text', 'Newest')

          cy.get('select')
            .select('Oldest')
            .then(() => {
              expectTaskToBeCalledWithSortby('created_on')
            })

          cy.get('select')
            .select('Company name A-Z')
            .then(() => {
              expectTaskToBeCalledWithSortby('company__name')
            })

          cy.get('select')
            .select('Company name Z-A')
            .then(() => {
              expectTaskToBeCalledWithSortby('-company__name')
            })
        })
    })

  })
)
