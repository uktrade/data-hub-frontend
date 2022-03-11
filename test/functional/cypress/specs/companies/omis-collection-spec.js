const qs = require('qs')

import { orderFaker } from '../../fakers/orders'
import { assertBreadcrumbs, assertPayload } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'

const fixtures = require('../../fixtures')

const { oneListCorp, archivedLtd } = fixtures.company

const buildQueryString = () =>
  qs.stringify({
    sortby: 'modified_on:desc',
  })

describe('Company Orders (OMIS) Collection Page', () => {
  const order1 = orderFaker({
    id: 111,
    reference: 'TMY947/21',
    company: {
      name: 'Williams-Rose',
    },
    contact: {
      name: 'Melissa Compton',
    },
    sector: {
      name: 'Advanced Engineering',
    },
    uk_region: {
      name: 'London',
    },
    created_on: '2020-11-30T01:28:26.124Z',
    modified_on: '2020-12-11T01:28:26.124Z',
    delivery_date: '2022-12-11T01:28:26.124Z',
    status: 'draft',
    primary_market: {
      name: 'The Bahamas',
    },
  })

  const order2 = orderFaker({
    delivery_date: null,
  })

  const ordersList = [order1, order2]

  before(() => {
    cy.intercept('POST', '/v3/search/order', {
      body: {
        count: ordersList.length,
        results: ordersList,
        summary: {
          total_subtotal_cost: 23218.0,
        },
      },
    }).as('apiRequest')
    cy.visit(urls.companies.orders(oneListCorp.id))
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
    cy.get('@collectionItems').eq(1).as('secondListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [oneListCorp.name]: urls.companies.detail(oneListCorp.id),
      'Orders (OMIS)': null,
    })
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'One List Corp')
  })

  it('should render a meta title', () => {
    cy.title().should('eq', 'Orders - One List Corp - Companies - DIT Data Hub')
  })

  it('should not render a "Remove all filters" button', () => {
    cy.get('[data-test="clear-filters"]').should('not.exist')
  })

  it('should render an "Add order" button', () => {
    cy.get('[data-test="add-collection-item-button"]')
      .should('exist')
      .should('contain', 'Add order')
      .should(
        'have.attr',
        'href',
        `/omis/create?company=${oneListCorp.id}&skip-company=true`
      )
  })

  it('should render the sort options', () => {
    cy.get('[data-test="sortby"] option').then((options) => {
      const sortOptions = [...options].map((o) => ({
        value: o.value,
        label: o.label,
      }))
      expect(sortOptions).to.deep.eq([
        { value: 'created_on:desc', label: 'Recently created' },
        { value: 'created_on:asc', label: 'Oldest' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'delivery_date:asc', label: 'Earliest delivery date' },
        { value: 'delivery_date:desc', label: 'Latest delivery date' },
      ])
    })
  })

  it('should have the total value', () => {
    cy.get('[data-test="summary"]')
      .should('exist')
      .should('contain', 'Total value: £232.18')
  })

  it('should display a list of orders', () => {
    cy.get('@collectionList').should('have.length', 1)
    cy.get('@collectionItems').should('have.length', ordersList.length)
  })

  context('API payload', () => {
    it('should have the correct payload', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/v3/search/order', {
        body: {
          count: ordersList.length,
          results: ordersList,
        },
      }).as('apiRequest')
      cy.visit(`${urls.companies.orders(oneListCorp.id)}?${queryString}`)
      assertPayload('@apiRequest', {
        offset: 0,
        limit: 10,
        sortby: 'modified_on:desc',
        company: oneListCorp.id,
      })
    })
  })

  context('The first order', () => {
    it('should have a link with the reference', () => {
      cy.get('@firstListItem')
        .find('h3')
        .children()
        .should('have.text', 'TMY947/21 (Order reference)')
        .should('have.attr', 'href', '/omis/111/work-order')
    })

    it('should contain "Draft" badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('have.text', 'Draft')
    })

    it('should contain "The Bahamas" badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .eq(1)
        .should('have.text', 'The Bahamas')
    })

    it('should render the updated date and time (modified_on)', () => {
      cy.get('@firstListItem')
        .find('h4')
        .should('have.text', 'Updated on 11 Dec 2020, 1:28am')
    })

    it('should render the company name', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('have.text', 'Company Williams-Rose')
    })

    it('should render the created date (created_on)', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('have.text', 'Created 30 Nov 2020, 1:28am')
    })

    it('should render the contact name', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should('have.text', 'Contact Melissa Compton')
    })

    it('should render the UK region', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('have.text', 'UK region London')
    })

    it('should render the sector', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(4)
        .should('have.text', 'Sector Advanced Engineering')
    })

    it('should render the delivery date (delivery_date)', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata-item"]')
        .eq(5)
        .should('have.text', 'Delivery date 11 Dec 2022')
    })
  })

  context('The second order', () => {
    it('should not render the delivery date (delivery_date)', () => {
      cy.get('@secondListItem')
        .find('[data-test="metadata-item"]')
        .should('not.have.text', 'Delivery date')
    })
  })

  context('when viewing orders for an archived company', () => {
    before(() => {
      cy.intercept('POST', '/v3/search/order', {
        body: {
          count: ordersList.length,
          results: ordersList,
          summary: {
            total_subtotal_cost: 23218.0,
          },
        },
      }).as('apiRequest')
      cy.visit(urls.companies.orders(archivedLtd.id))
      assertPayload('@apiRequest', {
        offset: 0,
        limit: 10,
        company: archivedLtd.id,
      })
    })

    it('should render the archived summary', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Why can I not add an order?'
      )
    })

    it('should render an archived explanation', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Orders cannot be added to an archived company.'
      )
    })

    it('should render "Click here to unarchive"', () => {
      cy.get('[data-test="archived-details"]')
        .find('a')
        .should('have.text', 'Click here to unarchive')
        .should('have.attr', 'href', `/companies/${archivedLtd.id}/unarchive`)
    })

    it('should not render an "Add order" button', () => {
      cy.get('[data-test="add-collection-item-button"]').should('not.exist')
    })
  })
})
