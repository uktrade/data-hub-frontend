/* eslint-disable prettier/prettier */
import _ from 'lodash'
import React from 'react'

import PaginatedResource from '../../../../../src/client/components/Resource/Paginated'
import TabNav from '../../../../../src/client/components/TabNav'
import { resolve } from '../../../../sandbox/utils.mjs'

const PAGE_SIZE = 10
const COUNT = 35
const DB = _.range(COUNT)
const PAGES = _.chunk(DB, PAGE_SIZE)

describe.skip('Resource/Paginated', () => {
  it('Should inject only the current page of results to children', () => {
    cy.mountWithProvider(
      <PaginatedResource name="foo" id="whatever" pageSize={PAGE_SIZE}>
        {(page) => <pre>{JSON.stringify(page)}</pre>}
      </PaginatedResource>,
      {
        tasks: {
          foo: (payload) => ({
            count: COUNT,
            results: DB.slice(payload.offset, payload.offset + payload.limit),
          }),
        },
      }
    )

    cy.get('[data-test="no-results"]').should('not.exist')

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

    // Go through pages backwards by clicking Previous page
    PAGES.slice(0, -1)
      .toReversed()
      .forEach((page) => {
        cy.get(`[data-test="prev"]`).click()
        cy.get('@page').should('have.text', JSON.stringify(page))
      })
  })

  it('Should load when mounted, even if the resource already has data', () => {
    cy.mountWithProvider(
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
              <PaginatedResource name="bar" id="whatever" pageSize={PAGE_SIZE}>
                {(page) => <pre>{JSON.stringify(page)}</pre>}
              </PaginatedResource>
            ),
          },
        ]}
      />,
      {
        tasks: {
          bar: (payload) =>
            resolve({
              after: 1,
              with: {
                count: COUNT,
                results: DB.slice(
                  payload.offset,
                  payload.offset + payload.limit
                ),
              },
            }),
        },
      }
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

  it('Should render the default no results message', () => {
    cy.mountWithProvider(
      <PaginatedResource name="foo" id="whatever" pageSize={PAGE_SIZE}>
        {(page) => <pre>{JSON.stringify(page)}</pre>}
      </PaginatedResource>,
      {
        tasks: {
          foo: () => ({
            count: 0,
            results: [],
          }),
        },
      }
    )
    cy.get('[data-test="pagination-summary"]').should('not.exist')
    cy.get('[data-test="pagination"]').should('not.exist')
    cy.get('[data-test="no-results"]').should(
      'have.text',
      "You don't have any results"
    )
  })

  it('Should override the default results message"', () => {
    cy.mountWithProvider(
      <PaginatedResource
        name="foo"
        id="whatever"
        pageSize={PAGE_SIZE}
        noResults="You don't have any sent export wins."
      >
        {(page) => <pre>{JSON.stringify(page)}</pre>}
      </PaginatedResource>,
      {
        tasks: {
          foo: () => ({
            count: 0,
            results: [],
          }),
        },
      }
    )
    cy.get('[data-test="no-results"]').should(
      'have.text',
      "You don't have any sent export wins."
    )
  })

  it('Should forward selected sortby option to the task payload', () => {
    const SORT_OPTIONS = [
      {name: 'Foo', value: 'foo'},
      {name: 'Bar', value: 'bar'},
      {name: 'Baz', value: 'baz'},
    ]

    const stub = cy.stub().returns({
      count: 1,
      results: ['blah'],
    })

    cy.mountWithProvider(
      <PaginatedResource
        name="foo"
        id="whatever"
        pageSize={PAGE_SIZE}
        noResults="You don't have any sent export wins."
        sortOptions={SORT_OPTIONS}
      >
        {(page) => <pre>{JSON.stringify(page)}</pre>}
      </PaginatedResource>,
      {
        tasks: {
          foo: stub,
        },
      }
    )
      .then(() => {
        expect(stub).to.have.been.calledOnceWith({
          limit: 10,
          offset: 0,
          sortby: 'foo',
        }, 'whatever')
      })

    cy.get('select option')
      .then($selection => {
        expect($selection.toArray().map(({innerText, value}) => ({
          name: innerText,
          value,
        }))).to.deep.eq(SORT_OPTIONS)
      })

    SORT_OPTIONS.forEach(({name, value}) => {
      cy.get('select').select(name)
        .then(() => {
          expect(stub).to.have.been.calledWith({
            limit: 10,
            offset: 0,
            sortby: value,
          }, 'whatever')
        })
    })
  })
})
