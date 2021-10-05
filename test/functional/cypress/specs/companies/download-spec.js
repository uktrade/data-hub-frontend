import qs from 'qs'

import urls from '../../../../../src/lib/urls'
import { companyListFaker } from '../../fakers/companies'

const downloadHeader = '[data-test="download-data-header"]'
const downloadButton = '[data-test="download-data-header"] a'

const apiEndpoint = '/api-proxy/v4/search/company'
const pageUrl = urls.companies.index()

describe('Download CSV', () => {
  context('When there are 0 companies', () => {
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: [],
          count: 0,
        },
      })
      cy.visit(pageUrl)
    })
    it('should not render the download header', () => {
      cy.get(downloadHeader).should('not.exist')
    })
  })

  context('When there is a single company', () => {
    const companiesList = companyListFaker(1)

    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: companiesList,
          count: companiesList.length,
        },
      })
      cy.visit(pageUrl)
    })

    it('should render the download header', () => {
      cy.get(downloadHeader).should('exist')
    })

    it('should render a download link', () => {
      cy.get(downloadButton)
        .should('exist')
        .should(
          'have.attr',
          'href',
          '/companies/export?archived%5B0%5D=false&sortby=modified_on%3Adesc'
        )
        .and('contain', 'Download')
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download this company'
      )
    })
  })

  context('When there are 4999 companies or less', () => {
    const companiesList = companyListFaker(9)
    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: companiesList,
          count: 4999,
        },
      })
      cy.visit(pageUrl)
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download these 4999 companies'
      )
    })
  })

  context('When there are 5000 companies or more', () => {
    const companiesList = companyListFaker(10)

    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: companiesList,
          count: 5000,
        },
      })
      cy.visit(pageUrl)
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'Filter to fewer than 5,000 companies to download'
      )
    })
  })

  context('When there are filters applied', () => {
    const companiesList = companyListFaker(1)
    const queryParams = {
      headquarter_type: ['global-hq'],
      name: 'Tesco',
      sector_descends: ['test-sector'],
      uk_postcode: 'AB1 2CD, EF3 4GH',
      uk_region: ['region-id'],
      archived: ['true'],
      country: ['uk-country-id'],
      export_to_countries: ['uk-country-id'],
      future_interest_countries: ['uk-country-id'],
      one_list_group_global_account_manager: ['adviser-id'],
    }
    const queryString = qs.stringify(queryParams)

    before(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: companiesList,
          count: companiesList.length,
        },
      })
      cy.visit(`/companies?${queryString}`)
    })

    it('should have the correct query string', () => {
      cy.get(downloadButton).should(
        'have.attr',
        'href',
        `/companies/export?${queryString}`
      )
    })
  })
})
