import { ordersListFaker, orderFaker } from '../../fakers/orders'
import {
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertAddItemButton,
  assertBadge,
  assertMetadataItem,
  assertMetadataItemNotPresent,
  assertListLength,
  assertOMISSumary,
  assertItemLink,
  assertUpdatedOn,
  assertRole,
} from '../../support/collection-list-assertions'
import { omisCollectionListRequest } from '../../support/actions'
import { omis } from '../../../../../src/lib/urls'

describe('Orders (OMIS) Collection List Page', () => {
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

  const ordersList = [order1, order2, ...ordersListFaker(8)]

  beforeEach(() => {
    omisCollectionListRequest('v3/search/order', ordersList, omis.index())
    getCollectionList()
    cy.get('@collectionItems').eq(1).as('secondListItem')
  })

  assertCollectionBreadcrumbs('Orders (OMIS)')

  it('should contain a status role', () => {
    assertRole('status')
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Orders (OMIS)')
  })

  it('should have a link to add order', () => {
    assertAddItemButton('Add order', '/omis/create')
  })

  assertOMISSumary('Total value: £232.18')

  it('should display a list of orders', () => {
    assertListLength(ordersList)
  })

  context('The first order', () => {
    it('should have a link with the reference', () => {
      assertItemLink(
        '@firstListItem',
        'TMY947/21 (Order reference)',
        '/omis/111/work-order'
      )
    })

    it('should contain "Draft" badge', () => {
      assertBadge('@firstListItem', 'Draft')
    })

    it('should contain "The Bahamas" badge', () => {
      assertBadge('@firstListItem', 'The Bahamas')
    })

    it('should render the updated date and time (modified_on)', () => {
      assertUpdatedOn('@firstListItem', 'Updated on 11 Dec 2020, 1:28am')
    })

    it('should render the company name', () => {
      assertMetadataItem('@firstListItem', 'Company')
      assertMetadataItem('@firstListItem', 'Williams-Rose')
    })

    it('should render the created date (created_on)', () => {
      assertMetadataItem('@firstListItem', 'Created')
      assertMetadataItem('@firstListItem', '30 Nov 2020, 1:28am')
    })

    it('should render the contact name', () => {
      assertMetadataItem('@firstListItem', 'Contact')
      assertMetadataItem('@firstListItem', 'Melissa Compton')
    })

    it('should render the UK region', () => {
      assertMetadataItem('@firstListItem', 'UK region')
      assertMetadataItem('@firstListItem', 'London')
    })

    it('should render the sector', () => {
      assertMetadataItem('@firstListItem', 'Sector')
      assertMetadataItem('@firstListItem', 'Advanced Engineering')
    })

    it('should render the delivery date (delivery_date)', () => {
      assertMetadataItem('@firstListItem', 'Delivery date')
      assertMetadataItem('@firstListItem', '11 Dec 2022')
    })
  })

  context('The second order', () => {
    it('should not render the delivery date (delivery_date)', () => {
      assertMetadataItemNotPresent('@secondListItem', 'Delivery date')
    })
  })
})
