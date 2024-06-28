import qs from 'qs'

import { ordersListFaker } from '../../fakers/orders'
import { omis } from '../../../../../src/lib/urls'
import { UK_REGIONS } from '../../../../../src/common/constants'

const downloadHeader = '[data-test="download-data-header"]'
const downloadButton = '[data-test="download-data-header"] a'
const apiEndpoint = '/api-proxy/v3/search/order'

describe('Download CSV', () => {
  context('When there are 0 orders', () => {
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: [],
          count: 0,
        },
      })
      cy.visit(omis.index())
    })
    it('should not render the download header', () => {
      cy.get(downloadHeader).should('not.exist')
    })
  })
  context('When there is a single order', () => {
    const ordersList = ordersListFaker()
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: ordersList,
          count: ordersList.length,
        },
      })
      cy.visit(omis.index())
    })
    it('should render the download header', () => {
      cy.get(downloadHeader).should('exist')
    })

    it('should render a download link', () => {
      cy.get(downloadButton)
        .should('exist')
        .should('have.attr', 'href', '/omis/export?sortby=created_on%3Adesc')
        .and('contain', 'Download')
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download this order'
      )
    })
  })
  context('When there are 4999 orders or less', () => {
    const ordersList = ordersListFaker(9)
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: ordersList,
          count: 4999,
        },
      })
      cy.visit(omis.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download these 4999 orders'
      )
    })
  })
  context('When there are 5000 orders or more', () => {
    const ordersList = ordersListFaker(10)
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: ordersList,
          count: 5000,
        },
      })
      cy.visit(omis.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'Filter to fewer than 5,000 orders to download'
      )
    })
  })
  context('When there are filters applied', () => {
    const ordersList = ordersListFaker(1)
    const queryString = qs.stringify({
      sortby: 'created_on:desc',
      status: 'complete',
      reference: 'YWA437/20',
      completed_on_after: '2020-01-25',
      completed_on_before: '2021-06-24',
      delivery_date_after: '2020-01-25',
      delivery_date_before: '2021-06-24',
      company_name: 'Tesco',
      contact_name: 'Jon Thistle',
      sector_descends: '9538cecc-5f95-e211-a939-e4115bead28a', // Aerospace
      primary_market: ['b05f66a0-5d95-e211-a939-e4115bead28a'], // Brazil
      uk_region: [UK_REGIONS.LONDON],
    })
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: ordersList,
          count: ordersList.length,
        },
      })
      cy.visit(`/omis?${queryString}`)
    })
    it('should have the correct query string', () => {
      cy.get(downloadButton).should(
        'have.attr',
        'href',
        `/omis/export?${queryString}`
      )
    })
  })
})
