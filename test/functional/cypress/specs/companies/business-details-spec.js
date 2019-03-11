const { keys, forEach } = require('lodash')

const oneListCorp = require('../../fixtures/one-list-corp.json')
const selectors = require('../../selectors/index.js')

describe('Companies business details', () => {
  context('when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK', () => {
    before(() => {
      cy.visit(`/companies/${oneListCorp.id}/business-details`)
    })

    it('should display the "Business details" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Business details')
    })

    it('should display the "Where does information on this page come from?" details summary', () => {
      cy.get(selectors.companyBusinessDetails().whereDoesInformation).should('be.visible')
    })

    it('should not display the "Unarchive" link', () => {
      cy.get(selectors.companyBusinessDetails().unarchiveLink).should('not.exist')
    })

    it('should display the "About" details container heading', () => {
      assertDetailsContainerHeading('aboutDetailsContainer', 'About One List Corp')
    })

    it('should not display the "About" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('aboutDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "About" details', () => {
      assertKeyValueTable('aboutDetails', {
        'Trading names': 'Not set',
        'Annual turnover': '£33.5M+',
        'Number of employees': '500+',
        'Website': 'Not set',
        'Description': 'This is a dummy company for testing the One List',
      })
    })

    it('should display the "Global Account Manager - One List" details container heading', () => {
      assertDetailsContainerHeading('oneListDetailsContainer', 'Global Account Manager – One List')
    })

    it('should not display the "Global Account Manager - One List" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "Global Account Manager - One List" details', () => {
      assertKeyValueTable('oneListDetails', {
        'One List tier': 'Tier A - Strategic Account',
        'Global Account Manager': 'Travis GreeneIST - Sector Advisory ServicesLondon',
      })
    })

    it('should display the "Business hierarchy" details container heading', () => {
      assertDetailsContainerHeading('businessHierarchyDetailsContainer', 'Business hierarchy')
    })

    it('should not display the "Business hierarchy" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('businessHierarchyDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "Business hierarchy" details', () => {
      assertKeyValueTable('businessHierarchyDetails', {
        'Headquarter type': 'Global HQ',
        'Subsidiaries': 'None',
      })
    })

    it('should display the "DIT sector" details container heading', () => {
      assertDetailsContainerHeading('sectorDetailsContainer', 'DIT sector')
    })

    it('should not display the "DIT sector" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('sectorDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "DIT sector" details', () => {
      assertValueTable('sectorDetails', [
        'Retail',
      ])
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
    })

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should not display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('not.exist')
    })

    it('should display the address', () => {
      const addressSelector = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector.badge(1)).should('have.text', 'Trading')
      cy.get(addressSelector.badge(2)).should('have.text', 'Registered')
      cy.get(addressSelector.line(1)).should('have.text', '12 St George\'s Road')
      cy.get(addressSelector.line(2)).should('have.text', 'Paris')
      cy.get(addressSelector.line(3)).should('have.text', '75001')
      cy.get(addressSelector.line(4)).should('have.text', 'France')
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsContainer').container).should('not.exist')
    })

    it('should not display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('not.exist')
    })
  })

  const assertDetailsContainerHeading = (dataAutoId, expected) => {
    cy.get(selectors.detailsContainer(dataAutoId).heading).should('have.text', expected)
  }

  const assertKeyValueTable = (dataAutoId, expected) => {
    forEach(keys(expected), (key, i) => {
      const rowNumber = i + 1
      cy.get(selectors.keyValueTable(dataAutoId).keyCell(rowNumber)).should('have.text', key)
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should('have.text', expected[key])
    })
  }

  const assertValueTable = (dataAutoId, expected) => {
    forEach(expected, (expectedValue, i) => {
      const rowNumber = i + 1
      cy.get(selectors.keyValueTable(dataAutoId).valueCell(rowNumber)).should('have.text', expectedValue)
    })
  }
})
