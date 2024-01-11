import '../../../../cypress/support/commands'

const expectedRows = {
  bmw: [
    {
      text: 'A1 BMW LTD!!!!!',
      linksTo: '/companies/a1138c1c-d449-4846-aa58-18fae7e1cb92',
    },
    {
      text: '14 Aug 2019',
    },
  ],
  oneList: [
    {
      text: 'One List Corp',
      linksTo: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0',
    },
    {
      text: '15 Aug 2019',
    },
  ],
  lambda: [
    {
      text: 'Lambda plc',
      linksTo: '/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa',
    },
    {
      text: '21 Mar 2019',
    },
  ],
  zebra: [
    {
      text: 'Zebra clothing',
      linksTo: '/companies/b89b1db3-7140-44ca-ad7a-9824c3c2gh74',
    },
    {
      text: '21 Feb 2019',
    },
  ],
  potatoes: [
    {
      text: 'Portable Potatoes',
      linksTo: '/companies/a30b1db3-7140-44ca-ad7a-9824c3c2ed56',
    },
    {
      text: '-',
    },
  ],
}

const describeTableCell = ({ row, col, text, linksTo }) =>
  describe(`Cell in column ${col}, row ${row}`, () => {
    it('Should have the expected text and behavior', () => {
      cy.get('table tbody tr')
        .eq(row)
        .find('td')
        .eq(col)
        .as('cell')
        .contains(text)

      if (linksTo !== undefined) {
        cy.get('@cell').find('a').should('have.attr', 'href', linksTo)
      }
    })
  })

const describeTable = (rows) => {
  describe('Table', () => {
    it(`It should have ${rows.length} rows`, () =>
      cy.get('table tbody tr').should('have.length', rows.length))

    describe('Cells', () => {
      rows.forEach((cells, row) =>
        describeTableCell({
          ...cells[0],
          row,
          col: 0,
        })
      )
    })
  })
}

const describeSortListBy = ({ option, rows }) =>
  describe(`Sort list by "${option}"`, () => {
    beforeEach(() => {
      cy.contains('Sort by').children('select').select(option)
    })

    it(`The option "${option}" should be selected`, () =>
      cy.contains('Sort by').find(':selected').should('have.text', option))
    describeTable(rows)
  })

const describeSortList = (rows) => {
  const recentRows = [...rows].sort(([, { text: a }], [, { text: b }]) =>
    b === '-' ? -1 : new Date(b) - new Date(a)
  )

  Object.entries({
    'Company name A-Z': [...rows].sort(([{ text: a }], [{ text: b }]) =>
      a.localeCompare(b)
    ),
    'Least recent interaction': [...recentRows].reverse(),
    'Recent interaction': recentRows,
  }).forEach(([option, rows]) => describeSortListBy({ option, rows }))
}

export let exports = {}

exports.expectedLists = {
  'List B': {
    deleteLinksTo: '/company-lists/75e14e32-292e-4d1b-a361-992d548251f7/delete',
    renameLinksTo: '/company-lists/75e14e32-292e-4d1b-a361-992d548251f7/rename',
    rows: [expectedRows.bmw],
    searches: {
      bmw: [expectedRows.bmw],
      foobar: [],
      a: [expectedRows.bmw],
    },
  },
  'List C': {
    deleteLinksTo: '/company-lists/a87af6bc-e117-47c7-ad3d-35f9900bbd0e/delete',
    renameLinksTo: '/company-lists/a87af6bc-e117-47c7-ad3d-35f9900bbd0e/rename',
  },
  'List A': {
    deleteLinksTo: '/company-lists/70513f19-0df6-4c8d-bef1-f11b65641ae4/delete',
    renameLinksTo: '/company-lists/70513f19-0df6-4c8d-bef1-f11b65641ae4/rename',
    rows: [
      expectedRows.oneList,
      expectedRows.bmw,
      expectedRows.lambda,
      expectedRows.zebra,
      expectedRows.potatoes,
    ],
    searches: {
      bmw: [expectedRows.bmw],
      one: [expectedRows.oneList],
      lam: [expectedRows.lambda],
      zebr: [expectedRows.zebra],
      pot: [expectedRows.potatoes],
      foobar: [],
      a: [
        expectedRows.bmw,
        expectedRows.lambda,
        expectedRows.zebra,
        expectedRows.potatoes,
      ],
    },
  },
}

exports.describeSelectedList = ({
  name,
  deleteLinksTo,
  renameLinksTo,
  rows = [],
  searches,
}) =>
  describe('Selected list', () => {
    describe('List selector', () =>
      it(`The "${name}" should be selected`, () =>
        cy.contains('View list').find(':selected').should('have.text', name)))

    describe('Delete list link', () =>
      it('The link should go to the correct url', () =>
        cy.contains('Delete list').should('have.attr', 'href', deleteLinksTo)))

    describe('Edit list name', () =>
      it('The link should go to the correct url', () =>
        cy
          .contains('Edit list name')
          .should('have.attr', 'href', renameLinksTo)))

    switch (rows.length) {
      case 0:
        describe("If the list doesn't have any companies", () =>
          it('Should display the empty state', () => {
            cy.contains('You have not added any companies to your list')
            cy.contains(
              'You can add companies to this list from a company page, and only you can see this list.'
            )
          }))
        break
      case 1:
        describe('If the list only has one company', () => {
          it('Filters should not be displayed', () => {
            cy.contains('Search this list').should('not.exist')
            cy.contains('Sort by').should('not.exist')
          })
        })
        break
      default:
        searches &&
          Object.entries(searches).forEach(([query, rows]) => {
            describe(`When the search query is "${query}"`, () => {
              beforeEach(() => {
                cy.contains('Search this list')
                  .find('input')
                  .clear()
                  .type(query)
              })
              describeTable(rows)
              describeSortList(rows)
            })
          })
    }
  })
