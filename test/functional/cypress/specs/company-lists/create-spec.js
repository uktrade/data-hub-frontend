const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')
const { testBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

describe('Create a company list', () => {
  context('when viewing a Create list form', () => {
    before(() => {
      cy.visit('/companies/4cd4128b-1bad-4f1e-9146-5d4678c6a018/lists/create')
    })

    testBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978':
        '/companies/4cd4128b-1bad-4f1e-9146-5d4678c6a018',
      'Create a list': undefined,
    })

    it('displays the "Create list" heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        'Create a list'
      )
    })

    it('displays the list name', () => {
      cy.get(selectors.companyList.create.label).should(
        'have.text',
        'List name'
      )
    })

    it('displays the hint', () => {
      cy.get(selectors.companyList.create.hint).should(
        'have.text',
        'This is a name only you see, and can be up to 30 characters'
      )
    })

    it('displays an input', () => {
      cy.get(selectors.companyList.create.input).should('exist')
    })

    it('displays an button', () => {
      cy.get(selectors.companyList.create.submit).should(
        'have.text',
        'Create list'
      )
    })

    it('displays a cancel link', () => {
      cy.get(selectors.companyList.create.cancel).should('have.text', 'Cancel')
    })
  })

  context('when submitting with no input', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/create`)
    })
    it('should display an error', () => {
      cy.get(selectors.companyList.create.submit).click()
      cy.get(selectors.companyList.create.error).should(
        'contain.text',
        'Enter a name for your list'
      )
    })
  })

  context('when submitting over 30 characters', () => {
    before(() => {
      cy.visit('/companies/4cd4128b-1bad-4f1e-9146-5d4678c6a018/lists/create')
    })
    it('should display an error', () => {
      cy.get(selectors.companyList.create.input).type(
        'loooooooooooooonnnnnnnnnnnnnggggggggg text!'
      )
      cy.get(selectors.companyList.create.submit).click()
      cy.get(selectors.companyList.create.error).should(
        'contain.text',
        'Enter list name which is no longer than 30 characters'
      )
    })
  })

  context('when submitting a valid list name', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/create`)
    })
    it('should display a success message', () => {
      cy.get(selectors.companyList.create.input).type('New list name')
      cy.get(selectors.companyList.create.submit).click()
      cy.get(selectors.localHeader().flash).should(
        'contain.text',
        'Company list created'
      )
    })
  })

  context('when cancelling the form', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.lambdaPlc.id}/lists/create`)
    })
    it('should return to the company page', () => {
      cy.get(selectors.companyList.create.cancel).click()
      cy.get(selectors.localHeader().heading).should(
        'contain.text',
        fixtures.company.lambdaPlc.name
      )
    })
  })
})
