import { assertLocalHeader, assertBreadcrumbs } from '../../support/assertions'
import { assertBadge } from '../../support/collection-list-assertions'
import { eybLeadFaker } from '../../fakers/eyb-leads'
import urls from '../../../../../src/lib/urls'

const setup = (eybLead) => {
  cy.intercept('GET', `/api-proxy/v4/investment-lead/eyb/${eybLead.id}`, {
    statusCode: 200,
    body: eybLead,
  }).as('getEYBLeadDetails')
  cy.intercept('GET', `/api-proxy/v4/investment-lead/eyb/${eybLead.id}/audit`, {
    statusCode: 200,
  }).as('getEYBLeadEditHistory')
}

const assertChanges = (itemNo, field, oldVal, newVal) => {
  it(`should display the changes to "${field}"`, () => {
    cy.get(`@listItem${itemNo}`)
      .should('contain', field)
      .and('contain', oldVal)
      .and('contain', newVal)
  })
}

describe('Edit History', () => {
  const eybLeadWithValues = eybLeadFaker({
    company: {
      name: 'Mars',
      id: 'fc752802-e454-4c7c-bbfd-4bdd84759b84',
    },
  })

  beforeEach(() => {
    setup(eybLeadWithValues)
    cy.visit(urls.investments.eybLeads.editHistory.index(eybLeadWithValues.id))
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('listItem1')
    cy.get('@collectionItems').eq(1).as('listItem2')
    cy.get('@collectionItems').eq(2).as('listItem3')
    cy.get('@collectionItems').eq(3).as('listItem4')
  })

  context('when viewing the "Edit History" page', () => {
    it('should render the header', () => {
      assertLocalHeader('Edit history')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        'EYB leads': urls.investments.eybLeads.index(),
        Mars: urls.investments.eybLeads.details(eybLeadWithValues.id),
        'Edit history': null,
      })
    })

    it('should render the collection header', () => {
      cy.get('[data-test="collection-header-name"]')
        .should('exist')
        .should('contain', '4 Changes to EYB lead details')
    })

    it('should render the correct badges', () => {
      assertBadge('@listItem1', '1 change')
      assertBadge('@listItem3', '1 change')
    })
  })

  context('when viewing the changes the correct values should be shown', () => {
    assertChanges(1, 'Value', 'Low', 'High')
    assertChanges(
      2,
      'Where do you want to set up in the UK?',
      'Cardiff',
      'Swansea'
    )
    assertChanges(
      3,
      'How do you plan to expand your business in the UK?',
      'Research develop and collaborate',
      'Set up a new distribution centre'
    )
    assertChanges(
      4,
      'How many people do you want to hire in the UK in the first 3 years?',
      'No plans to hire yet',
      '6-10'
    )
  })
})
