import _ from 'lodash'
import React from 'react'

import DataHubProvider from '../provider'
import PaginatedResource from '../../../../../src/client/components/Resource/Paginated'
import TabNav from '../../../../../src/client/components/TabNav'

const PAGE_SIZE = 10
const COUNT = 35
const DB = _.range(COUNT)
const PAGES = _.chunk(DB, PAGE_SIZE)

describe('Resource/Paginated', () => {
  it('Should inject only the current page of results to children', () => {
    cy.mount(
      <DataHubProvider
        resetTasks={true}
        tasks={{
          foo: (payload) => ({
            count: COUNT,
            results: DB.slice(payload.offset, payload.offset + payload.limit),
          }),
        }}
      >
        <PaginatedResource name="foo" id="whatever" pageSize={PAGE_SIZE}>
          {(page) => <pre>{JSON.stringify(page)}</pre>}
        </PaginatedResource>
      </DataHubProvider>
    )

    cy.get('pre').as('page').should('have.text', JSON.stringify(PAGES[0]))

    cy.get('[data-test="pagination-summary"]')
      .as('summary')
      .should('have.text', `Page 1 of ${PAGES.length}`)

    // Click on page numbers from highest to smallest
    PAGES.toReversed().forEach((page, i) => {
      const pageNumber = PAGES.length - i
      cy.get(`[data-page-number="${pageNumber}"]`).click()
      cy.get('@summary').should(
        'have.text',
        `Page ${pageNumber} of ${PAGES.length}`
      )
      cy.get('@page').should('have.text', JSON.stringify(page))
    })

    // Go through pages forwards by clicking Next
    PAGES.slice(1).forEach((page) => {
      cy.get(`[data-test="next"]`).click()
      cy.get('@page').should('have.text', JSON.stringify(page))
    })

    // Go through pages backwards by clicking Previous
    PAGES.slice(0, -1)
      .toReversed()
      .forEach((page) => {
        cy.get(`[data-test="prev"]`).click()
        cy.get('@page').should('have.text', JSON.stringify(page))
      })
  })

  it('Should load when mounted, even if the resource already has data', () => {
    cy.mount(
      <DataHubProvider
        resetTasks={true}
        tasks={{
          bar: async (payload) => ({
            count: COUNT,
            results: DB.slice(payload.offset, payload.offset + payload.limit),
          }),
        }}
      >
        <TabNav
          id="tab-nav"
          selectedIndex="1"
          label="Tab nav"
          tabs={[
            {
              label: 'Foo tab',
              content: 'Fooooo',
            },
            {
              label: 'Bar tab',
              content: (
                <PaginatedResource
                  name="bar"
                  id="whatever"
                  pageSize={PAGE_SIZE}
                >
                  {(page) => <pre>{JSON.stringify(page)}</pre>}
                </PaginatedResource>
              ),
            },
          ]}
        />
      </DataHubProvider>
    )

    cy.contains('Loading')
    cy.get('pre').as('page').should('have.text', JSON.stringify(PAGES[0]))

    // When we go to a different tab and back...
    cy.contains('Foo tab').click()
    cy.contains('Bar tab').click()

    // The resource should reload
    cy.contains('Loading')
    cy.get('pre').as('page').should('have.text', JSON.stringify(PAGES[0]))
  })
})
