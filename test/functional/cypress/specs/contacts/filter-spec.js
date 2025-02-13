import qs from 'qs'

import urls from '../../../../../src/lib/urls'

import { removeChip } from '../../support/actions'
import { testTypeahead, testTypeaheadOptionsLength } from '../../support/tests'
import {
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
  assertQueryParamsPlus,
} from '../../support/assertions'

import { contactsListFaker } from '../../fakers/contacts'
import { ukRegionListFaker } from '../../fakers/regions'
import { UK_REGIONS } from '../../../../../src/common/constants'

const searchEndpoint = '/api-proxy/v3/search/contact'
const ukRegionsEndpoint = '/api-proxy/v4/metadata/uk-region*'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    archived: ['false'],
    sortby: 'modified_on:desc',
    page: 1,
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby: 'modified_on:desc',
}

const activeStatusFlag = 'false'

describe('Contacts Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      const contactsList = contactsListFaker(10)
      cy.intercept('POST', searchEndpoint, {
        body: {
          count: contactsList.length,
          results: contactsList,
        },
      }).as('apiRequest')

      cy.visit(urls.contacts.index())

      // Second call to the api with default params
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          limit: 10,
          offset: 0,
          sortby: 'modified_on:desc',
          archived: false,
        })
      })

      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')

      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(1)
        .should('not.be.checked')
    })
  })

  context('Toggle groups', () => {
    it('should show contact details filters and hide them on toggle', () => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit('/contacts')
      cy.wait('@apiRequest')
      cy.get('[data-test="contact-name-filter"]').should('be.visible')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Contact details')
        .click()
      cy.get('[data-test="contact-name-filter"]').should('not.be.visible')
    })
  })

  context('Contact', () => {
    const element = '[data-test="contact-name-filter"]'
    const name = 'David Jones'
    const expectedPayload = {
      name,
      offset: 0,
      limit: 10,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ name })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParamsPlus('name', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(name)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Company', () => {
    const element = '[data-test="company-name-filter"]'
    const name = 'Tesco'
    const expectedPayload = {
      company_name: name,
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({ company_name: name })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('have.value', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest')

      cy.get(element).type(`${name}{enter}`)

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_name', name)
      assertChipExists({ label: name, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(name)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospaceId = '9538cecc-5f95-e211-a939-e4115bead28a'
    const expectedPayload = {
      company_sector_descends: [aerospaceId],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        company_sector_descends: [aerospaceId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest')

      testTypeahead({
        element,
        label: 'Sector',
        placeholder: 'Search sector',
        input: 'aero',
        expectedOption: 'Aerospace',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_sector_descends', [aerospaceId])
      assertChipExists({ label: 'Aerospace', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(aerospaceId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const brazilId = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    const expectedPayload = {
      address_country: [brazilId],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        address_country: [brazilId],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Contact location details')
        .click()

      testTypeahead({
        element,
        label: 'Country',
        placeholder: 'Search country',
        input: 'bra',
        expectedOption: 'Brazil',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('address_country', [brazilId])
      assertChipExists({ label: 'Brazil', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(brazilId)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('UK Region', () => {
    const element = '[data-test="uk-region-filter"]'
    const expectedPayload = {
      company_uk_region: [UK_REGIONS.LONDON],
      limit: 10,
      offset: 0,
      archived: false,
      sortby: 'modified_on:desc',
    }

    it('should display all UK regions (active & disabled) in the filter list', () => {
      const ukRegions = [
        ...ukRegionListFaker(2),
        ...ukRegionListFaker(2, { disabled_on: '2018-01-01' }),
      ]
      const queryString = buildQueryString()
      cy.intercept('GET', ukRegionsEndpoint, ukRegions).as(
        'ukRegionsApiRequest'
      )
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@ukRegionsApiRequest')
      cy.get('[data-test="toggle-section-button"]')
        .contains('Contact location details')
        .click()
      testTypeaheadOptionsLength({ element, length: ukRegions.length })
    })

    it('should filter from the url', () => {
      const queryString = buildQueryString({
        company_uk_region: [UK_REGIONS.LONDON],
      })
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      cy.get(element).should('contain', 'London')
      assertChipExists({ label: 'London', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(`/contacts?${queryString}`)
      cy.wait('@apiRequest')

      cy.get('[data-test="toggle-section-button"]')
        .contains('Contact location details')
        .click()

      testTypeahead({
        element,
        label: 'UK region',
        placeholder: 'Search UK region',
        input: 'lon',
        expectedOption: 'London',
      })

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })

      assertQueryParams('company_uk_region', [UK_REGIONS.LONDON])
      assertChipExists({ label: 'London', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(UK_REGIONS.LONDON)
      cy.wait('@apiRequest')
      removeChip(activeStatusFlag)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })

    it('should contain all UK regions (including the disabled ones)', () => {
      const queryString = buildQueryString()
      cy.visit(`/contacts?${queryString}`)
      cy.get('[data-test="toggle-section-button"]')
        .contains('Contact location details')
        .click()
      testTypeaheadOptionsLength({ element, length: 23 })
    })
  })

  context('Status (active/inactive)', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.index())
      cy.get('[data-test="status-filter"]').find('input').eq(0).as('active')
      cy.get('[data-test="status-filter"]').find('input').eq(1).as('inactive')
    })

    it('should filter by Active Status (explicit query params)', () => {
      const queryString = buildQueryString({ archived: ['false'] })
      cy.visit(`/contacts?${queryString}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('not.be.checked')
      assertChipExists({ label: 'Active', position: 1 })
    })

    it('should filter by Inactive Status', () => {
      const queryString = buildQueryString({ archived: ['true'] })
      cy.visit(`/contacts?${queryString}`)
      cy.get('@active').should('not.be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Inactive', position: 1 })
    })

    it('should filter by both Active and Inactive statuses (no filter)', () => {
      const queryString = buildQueryString({ archived: ['false', 'true'] })
      cy.visit(`/contacts?${queryString}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Inactive', position: 2 })
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const queryString = buildQueryString({
        page: 1,
        name: 'David Jones',
        company_name: 'Tesco',
        company_sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        company_uk_region: UK_REGIONS.LONDON,
        archived: ['false', 'true'],
      })
      cy.visit(`/contacts?${queryString}`)
      cy.get('[data-test=filter-chips]').children().as('filterChips')
    })

    it('should remove all filters and chips', () => {
      cy.get('[data-test=clear-filters]').click()
      cy.get('[data-test=filter-chips]').children().should('have.length', 0)
      cy.get('[data-test="contact-name-filter"]').should('have.value', '')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="country-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="uk-region-filter"]')
        .find('[data-test="typeahead-chip"]')
        .should('have.length', 0)
      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(0)
        .should('not.be.checked')
      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(1)
        .should('not.be.checked')
    })
  })
})
