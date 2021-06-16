import urls from '../../../../../src/lib/urls'
import qs from 'qs'

import {
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
} from '../../support/assertions'

import { selectFirstTypeaheadOption, removeChip } from '../../support/actions'

import { testTypeahead } from '../../support/tests'

describe('Contacts Collections Filter', () => {
  context('Contact', () => {
    const element = '[data-test="contact-name-filter"]'
    const contactNameQuery = 'David Jones'

    it('should filter from the url', () => {
      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')

      const queryParams = qs.stringify({ name: contactNameQuery })
      cy.visit(`${urls.contacts.react.index()}?${queryParams}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          name: contactNameQuery,
          limit: 10,
          offset: 0,
          sortby: 'modified_on:desc',
        })
      })
      cy.get(element).should('have.value', contactNameQuery)
      assertChipExists({ label: contactNameQuery, position: 1 })
    })

    it('should filter from user input', () => {
      cy.visit(urls.contacts.react.index())

      // Make sure the API has made all the initial calls by checking that the
      // default archived (active) param has been set. Alternatively you could
      // wait for the apiRequest to happen twice
      cy.get('[data-test="status-filter"]')
        .find('input')
        .eq(0)
        .should('be.checked')

      cy.intercept('POST', '/api-proxy/v3/search/contact').as('apiRequest')
      cy.get(element).type(`${contactNameQuery}{enter}`)

      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          name: contactNameQuery,
          limit: 10,
          offset: 0,
          sortby: 'modified_on:desc',
          archived: false,
        })
      })

      assertQueryParams('name', contactNameQuery)
      assertChipExists({ label: contactNameQuery, position: 1 })
      assertChipExists({ label: 'Active', position: 2 })

      removeChip(contactNameQuery)
      cy.wait('@apiRequest')
      removeChip('false') // Active
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          limit: 10,
          offset: 0,
          sortby: 'modified_on:desc',
        })
      })
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Company', () => {
    const element = '[data-test="company-name-filter"]'
    it('should filter from the url', () => {
      cy.visit(urls.contacts.react.index(), {
        qs: {
          company_name: 'Tesco',
        },
      })
      cy.get(element).should('have.value', 'Tesco')
      assertChipExists({ label: 'Tesco', position: 1 })
    })
    it('should filter from user input', () => {
      cy.visit(urls.contacts.react.index())
      cy.get(element).type('Tesco{enter}')
      assertQueryParams('company_name', 'Tesco')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Tesco', position: 2 })
    })
    it('should remove the chips', () => {
      cy.visit(urls.contacts.react.index())
      cy.get(element).type('Tesco{enter}')
      removeChip('Tesco')
      removeChip('false') // Active
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Sector', () => {
    const element = '[data-test="sector-filter"]'
    const aerospace = '9538cecc-5f95-e211-a939-e4115bead28a'
    it('should filter from the url', () => {
      cy.visit(urls.contacts.react.index(), {
        qs: {
          company_sector_descends: aerospace,
        },
      })
      cy.get(element).should('contain', 'Aerospace')
      assertChipExists({ label: 'Aerospace', position: 1 })
    })
    it('should filter from user input', () => {
      cy.visit(urls.contacts.react.index())
      testTypeahead({
        element,
        legend: 'Sector',
        placeholder: 'Search sectors',
        input: 'aero',
        expectedOption: 'Aerospace',
      })
      assertQueryParams('company_sector_descends', [aerospace])
      assertChipExists({ label: 'Aerospace', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
    })
    it('should remove the chips', () => {
      cy.visit(urls.contacts.react.index())
      selectFirstTypeaheadOption({
        element,
        input: 'aero',
      })
      removeChip(aerospace)
      removeChip('false') // Active
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Country', () => {
    const element = '[data-test="country-filter"]'
    const brazil = 'b05f66a0-5d95-e211-a939-e4115bead28a'
    it('should filter from the url', () => {
      cy.visit(urls.contacts.react.index(), {
        qs: {
          address_country: brazil,
        },
      })
      cy.get(element).should('contain', 'Brazil')
      assertChipExists({ label: 'Brazil', position: 1 })
    })
    it('should filter from user input', () => {
      cy.visit(urls.contacts.react.index())
      testTypeahead({
        element,
        legend: 'Country of origin',
        placeholder: 'Search countries',
        input: 'bra',
        expectedOption: 'Brazil',
      })
      assertQueryParams('address_country', [brazil])
      assertChipExists({ label: 'Brazil', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
    })
    it('should remove the chips', () => {
      cy.visit(urls.contacts.react.index())
      selectFirstTypeaheadOption({
        element,
        input: 'bra',
      })
      removeChip(brazil)
      removeChip('false') // Active
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('UK Region', () => {
    const element = '[data-test="uk-region-filter"]'
    const jersey = '924cd12a-6095-e211-a939-e4115bead28a'
    it('should filter from the url', () => {
      cy.visit(urls.contacts.react.index(), {
        qs: {
          company_uk_region: jersey,
        },
      })
      cy.get(element).should('contain', 'Jersey')
      assertChipExists({ label: 'Jersey', position: 1 })
    })
    it('should filter from user input', () => {
      cy.visit(urls.contacts.react.index())
      testTypeahead({
        element,
        legend: 'UK Region',
        placeholder: 'Search UK region',
        input: 'jer',
        expectedOption: 'Jersey',
      })
      assertQueryParams('company_uk_region', [jersey])
      assertChipExists({ label: 'Jersey', position: 1 })
      assertChipExists({ label: 'Active', position: 2 })
    })
    it('should remove the chips', () => {
      cy.visit(urls.contacts.react.index())
      selectFirstTypeaheadOption({
        element,
        input: 'jer',
      })
      removeChip(jersey)
      removeChip('false') // Active
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Status (active/inactive)', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.react.index())
      cy.get('[data-test="status-filter"]').find('input').eq(0).as('active')
      cy.get('[data-test="status-filter"]').find('input').eq(1).as('inactive')
    })
    it('should filter by Active Status (the default)', () => {
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('not.be.checked')
      assertQueryParams('archived', ['false'])
      assertChipExists({ label: 'Active', position: 1 })
    })
    it('should filter by Active Status (explicit query params)', () => {
      const queryParams = qs.stringify({ archived: ['false'] })
      cy.visit(`${urls.contacts.react.index()}?${queryParams}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('not.be.checked')
      assertChipExists({ label: 'Active', position: 1 })
    })
    it('should filter by Inactive Status', () => {
      const queryParams = qs.stringify({ archived: ['true'] })
      cy.visit(`${urls.contacts.react.index()}?${queryParams}`)
      cy.get('@active').should('not.be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Inactive', position: 1 })
    })
    it('should filter by both Active and Inactive statuses (no filter)', () => {
      const queryParams = qs.stringify({ archived: ['false', 'true'] })
      cy.visit(`${urls.contacts.react.index()}?${queryParams}`)
      cy.get('@active').should('be.checked')
      cy.get('@inactive').should('be.checked')
      assertChipExists({ label: 'Active', position: 1 })
      assertChipExists({ label: 'Inactive', position: 2 })
    })
  })

  context('Remove all filters', () => {
    before(() => {
      const queryParams = qs.stringify({
        page: 1,
        name: 'David Jones',
        company_name: 'Tesco',
        company_sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        company_uk_region: '924cd12a-6095-e211-a939-e4115bead28a',
        archived: ['false', 'true'],
      })
      cy.visit(`${urls.contacts.react.index()}?${queryParams}`)
      cy.get('[data-test=filter-chips]').children().as('filterChips')
    })
    it('should remove all filters and chips', () => {
      cy.get('@filterChips').should('have.length', 7)
      cy.get('[data-test=clear-filters]').click()
      cy.get('@filterChips').should('have.length', 0)
      cy.get('[data-test="contact-name-filter"]').should('have.value', '')
      cy.get('[data-test="company-name-filter"]').should('have.value', '')
      cy.get('[data-test="sector-filter"]').should('have.value', '')
      cy.get('[data-test="country-filter"]').should('have.value', '')
      cy.get('[data-test="uk-region-filter"]').should('have.value', '')
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
