const { keys, forEach } = require('lodash')

const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors/index.js')

describe('Companies business details', () => {
  context('when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/business-details`)
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

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should not display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('not.exist')
    })

    it('should display the address', () => {
      const addressSelector1 = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector1.badge(1)).should('not.exist')
      cy.get(addressSelector1.line(1)).should('have.text', '12 St George\'s Road')
      cy.get(addressSelector1.line(2)).should('have.text', 'Paris')
      cy.get(addressSelector1.line(3)).should('have.text', '75001')
      cy.get(addressSelector1.line(4)).should('have.text', 'France')

      const addressSelector2 = selectors.companyBusinessDetails().address(2)
      cy.get(addressSelector2.badge(1)).should('have.text', 'Registered')
      cy.get(addressSelector2.line(1)).should('have.text', '12 St George\'s Road')
      cy.get(addressSelector2.line(2)).should('have.text', 'Paris')
      cy.get(addressSelector2.line(3)).should('have.text', '75001')
      cy.get(addressSelector2.line(4)).should('have.text', 'France')
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
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

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should not display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('not.exist')
    })
  })

  context('when viewing business details for a Data Hub company in the UK', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/business-details`)
    })

    it('should display the "Business details" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Business details')
    })

    it('should not display the "Where does information on this page come from?" details summary', () => {
      cy.get(selectors.companyBusinessDetails().whereDoesInformation).should('not.exist')
    })

    it('should not display the "Unarchive" link', () => {
      cy.get(selectors.companyBusinessDetails().unarchiveLink).should('not.exist')
    })

    it('should display the "About" details container heading', () => {
      assertDetailsContainerHeading('aboutDetailsContainer', 'About Venus Ltd')
    })

    it('should display the "About" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('aboutDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "About" details', () => {
      assertKeyValueTable('aboutDetails', {
        'Business type': 'Company',
        'Trading names': 'Not set',
        'CDMS reference': 'ORG-10096257',
        'Annual turnover': 'Not set',
        'Number of employees': 'Not set',
        'Website': 'Not set',
      })
    })

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('be.visible')
    })

    it('should display the address', () => {
      const addressSelector1 = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector1.badge(1)).should('not.exist')
      cy.get(addressSelector1.line(1)).should('have.text', '66 Marcham Road')
      cy.get(addressSelector1.line(2)).should('have.text', 'Bordley')
      cy.get(addressSelector1.line(3)).should('have.text', 'BD23 8RZ')
      cy.get(addressSelector1.line(4)).should('have.text', 'United Kingdom')

      const addressSelector2 = selectors.companyBusinessDetails().address(2)
      cy.get(addressSelector2.badge(1)).should('have.text', 'Registered')
      cy.get(addressSelector2.line(1)).should('have.text', '66 Marcham Road')
      cy.get(addressSelector2.line(2)).should('have.text', 'Bordley')
      cy.get(addressSelector2.line(3)).should('have.text', 'BD23 8RZ')
      cy.get(addressSelector2.line(4)).should('have.text', 'United Kingdom')
    })

    it('should display the "DIT region" details container heading', () => {
      assertDetailsContainerHeading('regionDetailsContainer', 'DIT region')
    })

    it('should display the "DIT region" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "DIT region" details', () => {
      assertValueTable('regionDetails', [
        'North West',
      ])
    })

    it('should display the "DIT sector" details container heading', () => {
      assertDetailsContainerHeading('sectorDetailsContainer', 'DIT sector')
    })

    it('should display the "DIT sector" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('sectorDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "DIT sector" details', () => {
      assertValueTable('sectorDetails', [
        'Retail',
      ])
    })

    it('should display the "Global Account Manager - One List" details container heading', () => {
      assertDetailsContainerHeading('oneListDetailsContainer', 'Global Account Manager – One List')
    })

    it('should display the "Global Account Manager - One List" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').editLink).should('be.visible')
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

    it('should display the "Business hierarchy" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('businessHierarchyDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "Business hierarchy" details', () => {
      assertKeyValueTable('businessHierarchyDetails', {
        'Global HQ': 'Archived Ltd Remove link',
      })
    })

    it('should display the "Documents from CDMS" details container heading', () => {
      assertDetailsContainerHeading('documentsDetailsContainer', 'Documents from CDMS')
    })

    it('should display the "Documents from CDMS" details', () => {
      assertValueTable('documentsDetails', [
        'View files and documents (will open another website)',
      ])
    })

    it('should display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('be.visible')
    })
  })

  context('when viewing business details for a Dun & Bradstreet company not on the One List', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.dnbCorp.id}/business-details`)
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
      assertDetailsContainerHeading('aboutDetailsContainer', 'About DnB Corp')
    })

    it('should not display the "About" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('aboutDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "About" details', () => {
      assertKeyValueTable('aboutDetails', {
        'Trading names': 'DnBD&B',
        'Annual turnover': '£750,148.00This is an estimated numberWhat does that mean?Actual turnover is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
        'Number of employees': '95This is an estimated numberWhat does that mean?Actual number of employees is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
        'Website': 'Not set',
      })
    })

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should not display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('not.exist')
    })

    it('should display the address', () => {
      const addressSelector1 = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector1.badge(1)).should('not.exist')
      cy.get(addressSelector1.line(1)).should('have.text', '1 Main Road')
      cy.get(addressSelector1.line(2)).should('have.text', 'Rome')
      cy.get(addressSelector1.line(3)).should('have.text', '001122')
      cy.get(addressSelector1.line(4)).should('have.text', 'Italy')

      const addressSelector2 = selectors.companyBusinessDetails().address(2)
      cy.get(addressSelector2.badge(1)).should('have.text', 'Registered')
      cy.get(addressSelector2.line(1)).should('have.text', '1 Main Road')
      cy.get(addressSelector2.line(2)).should('have.text', 'Rome')
      cy.get(addressSelector2.line(3)).should('have.text', '001122')
      cy.get(addressSelector2.line(4)).should('have.text', 'Italy')
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
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

    it('should not display the "Global Account Manager - One List" details container', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').container).should('not.exist')
    })

    it('should display the "Business hierarchy" details container heading', () => {
      assertDetailsContainerHeading('businessHierarchyDetailsContainer', 'Business hierarchy')
    })

    it('should not display the "Business hierarchy" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('businessHierarchyDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "Business hierarchy" details', () => {
      assertKeyValueTable('businessHierarchyDetails', {
        'Global HQ': 'None',
      })
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should not display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('not.exist')
    })
  })

  context('when viewing business details for an archived Data Hub company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/business-details`)
    })

    it('should display the "Business details" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Business details')
    })

    it('should not display the "Where does information on this page come from?" details summary', () => {
      cy.get(selectors.companyBusinessDetails().whereDoesInformation).should('not.exist')
    })

    it('should display the "Unarchive" link', () => {
      cy.get(selectors.companyBusinessDetails().unarchiveLink).should('be.visible')
    })

    it('should display the "About" details container heading', () => {
      assertDetailsContainerHeading('aboutDetailsContainer', 'About Archived Ltd')
    })

    it('should not display the "About" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('aboutDetailsContainer').editLink).should('not.exist')
    })

    it('should display the "About" details', () => {
      assertKeyValueTable('aboutDetails', {
        'Business type': 'Company',
        'Trading names': 'Not set',
        'Annual turnover': '£33.5M+',
        'Number of employees': '500+',
        'Website': 'Not set',
      })
    })

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should not display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('not.exist')
    })

    it('should display the address', () => {
      const addressSelector1 = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector1.badge(1)).should('not.exist')
      cy.get(addressSelector1.line(1)).should('have.text', '16 Getabergsvagen')
      cy.get(addressSelector1.line(2)).should('have.text', 'Geta')
      cy.get(addressSelector1.line(3)).should('have.text', '22340')
      cy.get(addressSelector1.line(4)).should('have.text', 'Malta')

      const addressSelector2 = selectors.companyBusinessDetails().address(2)
      cy.get(addressSelector2.badge(1)).should('have.text', 'Registered')
      cy.get(addressSelector2.line(1)).should('have.text', '16 Getabergsvagen')
      cy.get(addressSelector2.line(2)).should('have.text', 'Geta')
      cy.get(addressSelector2.line(3)).should('have.text', '22340')
      cy.get(addressSelector2.line(4)).should('have.text', 'Malta')
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
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
        'Subsidiaries': '1 subsidiary',
      })
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should not display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('not.exist')
    })
  })

  context('when viewing business details for a company with minimal data', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.minimallyMinimalLtd.id}/business-details`)
    })

    it('should display the "Business details" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Business details')
    })

    it('should not display the "Where does information on this page come from?" details summary', () => {
      cy.get(selectors.companyBusinessDetails().whereDoesInformation).should('not.exist')
    })

    it('should not display the "Unarchive" link', () => {
      cy.get(selectors.companyBusinessDetails().unarchiveLink).should('not.exist')
    })

    it('should display the "About" details container heading', () => {
      assertDetailsContainerHeading('aboutDetailsContainer', 'About Minimally Minimal Ltd')
    })

    it('should display the "About" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('aboutDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "About" details', () => {
      assertKeyValueTable('aboutDetails', {
        'Trading names': 'Not set',
        'Annual turnover': 'Not set',
        'Number of employees': 'Not set',
        'Website': 'Not set',
      })
    })

    it('should display the "Addresses" details container heading', () => {
      assertDetailsContainerHeading('addressesDetailsContainer', 'Addresses')
    })

    it('should display the "Addresses" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('addressesDetailsContainer').editLink).should('be.visible')
    })

    it('should display the address', () => {
      const addressSelector1 = selectors.companyBusinessDetails().address(1)
      cy.get(addressSelector1.badge(1)).should('not.exist')
      cy.get(addressSelector1.line(1)).should('have.text', 'United Kingdom')

      const addressSelector2 = selectors.companyBusinessDetails().address(2)
      cy.get(addressSelector2.badge(1)).should('not.exist')
      cy.get(addressSelector2.line(1)).should('not.exist')
      cy.get(addressSelector2.line(2)).should('not.exist')
      cy.get(addressSelector2.line(3)).should('not.exist')
      cy.get(addressSelector2.line(4)).should('not.exist')
    })

    it('should display the "DIT region" details container heading', () => {
      assertDetailsContainerHeading('regionDetailsContainer', 'DIT region')
    })

    it('should display the "DIT region" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "DIT region" details', () => {
      assertValueTable('regionDetails', [
        'Not set',
      ])
    })

    it('should display the "DIT sector" details container heading', () => {
      assertDetailsContainerHeading('sectorDetailsContainer', 'DIT sector')
    })

    it('should display the "DIT sector" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('sectorDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "DIT sector" details', () => {
      assertValueTable('sectorDetails', [
        'Advanced Engineering',
      ])
    })

    it('should not display the "Global Account Manager - One List" details container heading', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').container).should('not.exist')
    })

    it('should display the "Business hierarchy" details container heading', () => {
      assertDetailsContainerHeading('businessHierarchyDetailsContainer', 'Business hierarchy')
    })

    it('should display the "Business hierarchy" details container "Edit" link', () => {
      cy.get(selectors.detailsContainer('businessHierarchyDetailsContainer').editLink).should('be.visible')
    })

    it('should display the "Business hierarchy" details', () => {
      assertKeyValueTable('businessHierarchyDetails', {
        'Global HQ': 'None Link to the Global HQ',
      })
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('be.visible')
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
