const { company, contact, investmentProject } = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const {
  formatDate,
  DATE_FORMAT_COMPACT,
} = require('../../../../../src/client/utils/date-utils')
const {
  assertFlashMessage,
} = require('../../../../functional/cypress/support/assertions')
const {
  NOT_SET,
} = require('../../../../../src/client/components/AuditHistory/constants')
const {
  assertBadge,
  assertBadgeNotPresent,
} = require('../../../../functional/cypress/support/collection-list-assertions')

const todaysDate = formatDate(new Date(), DATE_FORMAT_COMPACT)
let companyObj
let contactObj
let investmentProjectObj

describe('Company', () => {
  before(() => {
    companyObj = company.create.defaultCompany()
    cy.loadFixture([companyObj])
    cy.visit(urls.companies.edit(companyObj.pk))
  })

  it('should display name of the person who made company record changes', () => {
    cy.get(selectors.companyEdit.website).clear().type('www.example.com')

    cy.get(selectors.companyEdit.saveButton).click()
    cy.contains('div', 'Company record updated').should(
      'have.attr',
      'data-test',
      'status-message'
    )

    cy.visit(urls.companies.editHistory.index(companyObj.pk))
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('listItem1')

    cy.get('@listItem1')
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')
      .and('contain', "Company's website")
      .and('contain', NOT_SET)
      .and('contain', 'http://www.example.com')

    cy.get('[data-test="collection-header-name"]')
      .should('exist')
      .should('contain', '1 change')

    assertBadge('@listItem1', '1 change')
  })
})

describe('Contact', () => {
  before(() => {
    companyObj = company.create.defaultCompany()
    contactObj = contact.create(companyObj.pk)
    cy.loadFixture([companyObj])
    cy.loadFixture([contactObj])
    cy.visit(urls.contacts.edit(contactObj.pk))

    cy.contains('Job title').type('Freerider')
    cy.contains('Phone number')
      .parent()
      .next()
      .next()
      .find('input')
      .clear()
      .type('44 87643213456')
  })

  it('should display name of the person who made contact record changes', () => {
    cy.getSubmitButtonByLabel('Save and return').click()
    cy.contains('Contact record updated')

    cy.visit(urls.contacts.audit(contactObj.pk))

    cy.get('[data-test=collection-item]')
      .should('contain', 'DIT Staff')
      .and('contain', todaysDate)
      .and('contain', 'Job title')
      .and('contain', 'Not set')
      .and('contain', 'Freerider')
      .and('contain', 'Full telephone number')
      .and('contain', '44 67890123432')
      .and('contain', '44 87643213456')
    cy.get('[data-test="collection-header-name"]')
      .should('exist')
      .should('have.text', '1 contact change')
    assertBadge('[data-test=collection-item]', '2 changes')
  })
})

describe('Investment Project', () => {
  before(() => {
    investmentProjectObj = investmentProject.create.newHotelFdi()
    cy.loadFixture([investmentProjectObj])
    cy.visit(urls.investments.projects.editDetails(investmentProjectObj.pk))
  })

  it('should display name of the person who made investment project record changes', () => {
    cy.intercept('api-proxy/v4/metadata/investment-specific-programme*').as(
      'apiRequest'
    )
    cy.wait('@apiRequest')
    cy.get('[data-test="submit"]').click()
    assertFlashMessage('Investment details updated')

    cy.visit(urls.investments.editHistory.index(investmentProjectObj.pk))
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('listItem1')

    cy.get('@listItem1')
      .should('contain', todaysDate)
      .and('contain', 'DIT Staff')
      .and('contain', 'No changes were made to the project in this update')

    cy.get('[data-test="collection-header-name"]')
      .should('exist')
      .should('contain', '1 project change')

    assertBadgeNotPresent('@listItem1')
  })
})
