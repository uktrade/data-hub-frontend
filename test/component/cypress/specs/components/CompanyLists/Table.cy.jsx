import React from 'react'

import Table from '../../../../../../src/client/components/CompanyLists/Table'

const allOptionalData = {
  date: '2019-08-15',
  ditParticipants: [
    { name: 'Barry Oling', team: 'Isle of Wight Chamber of Commerce' },
    { name: 'Bernard Harris-Patel', team: 'Isle of Wight Chamber of Commerce' },
  ],
  id: '375094ac-f79a-43e5-9c88-059a7caa17f0',
  interactionId: '79d92719-7402-45b6-b3d7-eff559d6b282',
  name: 'One List Corp',
  subject:
    'Here is a long interaction title some more text some more text some more text almost finished some more text nearly there more text finished',
}

const singleAdviser = {
  date: '2019-08-18',
  ditParticipants: [
    { name: 'Barry Oling', team: 'Isle of Wight Chamber of Commerce' },
  ],
  id: 'a1138c1c-d449-4846-aa58-18fae7e1cb92',
  interactionId: '79d92719-7402-45b6-b3d7-eff559d6b282',
  name: 'BMW',
  subject: 'Here is a long interaction title some more text some more text',
}

const singleAdviserWithNoData = {
  date: '2019-08-18',
  ditParticipants: [{ name: '', team: '' }],
  id: 'a1138c1c-d449-4846-aa58-18fae7e1cb92',
  interactionId: '79d92719-7402-45b6-b3d7-eff559d6b282',
  name: 'BMW',
  subject: 'Here is a long interaction title some more text some more text',
}

const noOptionalData = {
  date: '',
  ditParticipants: [],
  id: '0fb3379c-341c-4da4-b825-bf8d47b26baa',
  interactionId: '',
  name: 'Lambda plc',
  subject: 'Lorem ipsum dolor sit amet,',
}

const expectedRowData = [
  //allOptionalData
  [
    {
      text: 'One List Corp',
      linksTo: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0',
    },
    {
      text: '15 Aug 2019',
    },
    {
      text: allOptionalData.subject,
      linksTo: '/interactions/79d92719-7402-45b6-b3d7-eff559d6b282',
    },
    {
      text: 'Multiple advisers',
    },
  ],
  // noOptionalData:
  [
    {
      text: 'Lambda plc',
      linksTo: '/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa',
    },
    {
      text: '-',
    },
    {
      text: 'No interactions have been recorded',
    },
    {
      text: 'Unknown adviser - Unknown team',
    },
  ],
  //singleAdviser
  [
    {
      text: 'BMW',
      linksTo: '/companies/a1138c1c-d449-4846-aa58-18fae7e1cb92',
    },
    {
      text: '18 Aug 2019',
    },
    {
      text: 'Here is a long interaction title some more text some more text',
      linksTo: '/interactions/79d92719-7402-45b6-b3d7-eff559d6b282',
    },
    {
      text: 'Barry Oling - Isle of Wight Chamber of Commerce',
    },
  ],
  //singleAdviserWithNoData
  [
    {
      text: 'BMW',
      linksTo: '/companies/a1138c1c-d449-4846-aa58-18fae7e1cb92',
    },
    {
      text: '18 Aug 2019',
    },
    {
      text: 'Here is a long interaction title some more text some more text',
      linksTo: '/interactions/79d92719-7402-45b6-b3d7-eff559d6b282',
    },
    {
      text: 'Unknown adviser - Unknown team',
    },
  ],
]

const describeTableCell = (cell, col, row) => {
  cy.get('@tableRows')
    .eq(row)
    .find('td')
    .eq(col)
    .should(($elm) => {
      const elText = $elm.text()
      expect(elText).equal(cell.text)
    })
    .as('cell')

  if (cell.linksTo === undefined) {
    return
  } else {
    cy.get('@cell').find('a').should('have.attr', 'href', cell.linksTo)
  }
}

describe('CompanyLists Table', () => {
  const Component = ({ companies }) => <Table companies={companies} />

  it('renders the rows', () => {
    const rows = [
      allOptionalData,
      noOptionalData,
      singleAdviser,
      singleAdviserWithNoData,
    ]
    cy.mount(<Component companies={rows} />)
    cy.get('table tbody tr').as('tableRows')
    cy.get('@tableRows').should('have.length', rows.length)

    expectedRowData.forEach((cells, row) => {
      cells.forEach((cell, col) => {
        describeTableCell(cell, col, row)
      })
    })
  })
})
