const { assertKeyValueTable, assertValueTable, assertBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const assertSummaryTable = ({ dataAutoId, heading, showEditLink, content }) => {
  const summaryTableSelector = `[data-auto-id="${dataAutoId}"]`

  cy.get(summaryTableSelector).find('caption').should('contain', heading)
  cy.get(summaryTableSelector).contains('Edit').should(showEditLink ? 'be.visible' : 'not.be.visible')

  if (typeof content !== 'undefined') {
    Array.isArray(content)
      ? assertValueTable(dataAutoId, content)
      : assertKeyValueTable(dataAutoId, content)
  }
}

const assertAddress = ({ address, registeredAddress }) => {
  const addressSelector1 = '[data-auto-id="addressesDetailsContainer"] td:nth-child(1)'
  const addressSelector2 = '[data-auto-id="addressesDetailsContainer"] td:nth-child(2)'

  if (address) {
    cy.get(addressSelector1).contains('Registered').should('not.exist')
    address.map((line, index) => {
      cy.get(addressSelector1).find(`li:nth-child(${index + 1})`).should('have.text', line)
    })
  } else if (address === null) {
    cy.get(addressSelector1).should('not.exist')
  }

  if (registeredAddress) {
    cy.get(addressSelector2).contains('Registered').should('exist')
    registeredAddress.map((line, index) => {
      cy.get(addressSelector2).find(`li:nth-child(${index + 1})`).should('have.text', line)
    })
  } else if (registeredAddress === null) {
    cy.get(addressSelector2).should('not.exist')
  }
}

describe('Companies business details', () => {
  context('when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/business-details2`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.oneListCorp.name]: `/companies/${fixtures.company.oneListCorp.id}`,
        'Business details': null,
      })
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

    it('should display the "About" details container', () => {
      assertSummaryTable({
        dataAutoId: 'aboutDetailsContainer',
        heading: 'About One List Corp',
        showEditLink: false,
        content: {
          'Trading names': 'Not set',
          'Annual turnover': '£33.5M+',
          'Number of employees': '500+',
          'Website': 'Not set',
        },
      })
    })

    it('should display the "Addresses" details container', () => {
      assertSummaryTable({
        dataAutoId: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: false,
      })
    })

    it('should display the address', () => {
      assertAddress({
        address: [
          "12 St George's Road",
          'Paris',
          '75001',
          'France',
        ],
        registeredAddress: [
          "12 St George's Road",
          'Paris',
          '75001',
          'France',
        ],
      })
    })

    it('should display the "Description" details container', () => {
      assertSummaryTable({
        dataAutoId: 'descriptionDetailsContainer',
        heading: 'Description',
        showEditLink: true,
        content: [
          'This is a dummy company for testing the One List',
        ],
      })
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
    })

    it('should display the "DIT sector" details container', () => {
      assertSummaryTable({
        dataAutoId: 'sectorDetailsContainer',
        heading: 'DIT sector',
        showEditLink: true,
        content: [
          'Retail',
        ],
      })
    })

    it('should display the "Global Account Manager - One List" details container', () => {
      assertSummaryTable({
        dataAutoId: 'oneListDetailsContainer',
        heading: 'Global Account Manager – One List',
        showEditLink: false,
        content: {
          'One List tier': 'Tier A - Strategic Account',
          'Global Account Manager': 'Travis GreeneIST - Sector Advisory ServicesLondon',
        },
      })
    })

    it('should display the "Business hierarchy" details container heading', () => {
      assertSummaryTable({
        dataAutoId: 'businessHierarchyDetailsContainer',
        heading: 'Business hierarchy',
        showEditLink: false,
        content: {
          'Headquarter type': 'Global HQ',
          'Subsidiaries': 'NoneLink a subsidiary',
        },
      })
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should not display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('not.exist')
    })
  })

  context('when viewing business details for a Data Hub company on the One List in the UK', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/business-details2`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.venusLtd.name]: `/companies/${fixtures.company.venusLtd.id}`,
        'Business details': null,
      })
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

    it('should display the "About" details container', () => {
      assertSummaryTable({
        dataAutoId: 'aboutDetailsContainer',
        heading: 'About Venus Ltd',
        showEditLink: true,
        content: {
          'Business type': 'Company',
          'Trading names': 'Not set',
          'CDMS reference': 'ORG-10096257',
          'Annual turnover': 'Not set',
          'Number of employees': 'Not set',
          'Website': 'Not set',
        },
      })
    })

    it('should display the "Addresses" details container', () => {
      assertSummaryTable({
        dataAutoId: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: true,
      })
    })

    it('should display the address', () => {
      assertAddress({
        address: [
          '66 Marcham Road',
          'Bordley',
          'BD23 8RZ',
          'United Kingdom',
        ],
        registeredAddress: [
          '66 Marcham Road',
          'Bordley',
          'BD23 8RZ',
          'United Kingdom',
        ],
      })
    })

    it('should display the "DIT region" details container', () => {
      assertSummaryTable({
        dataAutoId: 'regionDetailsContainer',
        heading: 'DIT region',
        showEditLink: true,
        content: ['North West'],
      })
    })

    it('should display the "DIT sector" details container', () => {
      assertSummaryTable({
        dataAutoId: 'sectorDetailsContainer',
        heading: 'DIT sector',
        showEditLink: true,
        content: ['Retail'],
      })
    })

    it('should display the "Global Account Manager - One List" details container', () => {
      assertSummaryTable({
        dataAutoId: 'oneListDetailsContainer',
        heading: 'Global Account Manager – One List',
        showEditLink: true,
        content: {
          'One List tier': 'Tier A - Strategic Account',
          'Global Account Manager': 'Travis GreeneIST - Sector Advisory ServicesLondon',
        },
      })
    })

    it('should display the "Business hierarchy" details container', () => {
      assertSummaryTable({
        dataAutoId: 'businessHierarchyDetailsContainer',
        heading: 'Business hierarchy',
        showEditLink: true,
        content: {
          'Global HQ': 'Archived LtdRemove link',
        },
      })
    })

    it('should display the "Documents from CDMS" details container', () => {
      assertSummaryTable({
        dataAutoId: 'documentsDetailsContainer',
        heading: 'Documents from CDMS',
        showEditLink: false,
        content: [
          'View files and documents (Opens in a new window)',
        ],
      })
    })

    it('should display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('be.visible')
    })
  })

  context('when viewing business details for a Dun & Bradstreet company not on the One List', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.dnbCorp.id}/business-details2`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.dnbCorp.name]: `/companies/${fixtures.company.dnbCorp.id}`,
        'Business details': null,
      })
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

    it('should display the "About" details container', () => {
      assertSummaryTable({
        dataAutoId: 'aboutDetailsContainer',
        heading: 'About DnB Corp',
        showEditLink: false,
        content: {
          'Trading names': 'DnBD&B',
          'Annual turnover': '£750,148This is an estimated numberWhat does that mean?Actual turnover is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
          'Number of employees': '95This is an estimated numberWhat does that mean?Actual number of employees is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
          'Website': 'Not set',
        },
      })
    })

    it('should display the "Addresses" details container', () => {
      assertSummaryTable({
        dataAutoId: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: false,
      })
    })

    it('should display the address', () => {
      assertAddress({
        address: [
          '1 Main Road',
          'Rome',
          '001122',
          'Italy',
        ],
        registeredAddress: [
          '1 Main Road',
          'Rome',
          '001122',
          'Italy',
        ],
      })
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
    })

    it('should display the "DIT sector" details container', () => {
      assertSummaryTable({
        dataAutoId: 'sectorDetailsContainer',
        heading: 'DIT sector',
        showEditLink: true,
        content: ['Retail'],
      })
    })

    it('should not display the "Global Account Manager - One List" details container', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').container).should('not.exist')
    })

    it('should display the "Business hierarchy" details container', () => {
      assertSummaryTable({
        dataAutoId: 'businessHierarchyDetailsContainer',
        heading: 'Business hierarchy',
        showEditLink: false,
        content: {
          'Global HQ': 'NoneLink to the Global HQ',
        },
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
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/business-details2`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.archivedLtd.name]: `/companies/${fixtures.company.archivedLtd.id}`,
        'Business details': null,
      })
    })

    it('should display the "Business details" heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', 'Business details')
    })

    it('should not display the "Where does information on this page come from?" details summary', () => {
      cy.get(selectors.companyBusinessDetails().whereDoesInformation).should('not.exist')
    })

    it('should display the "Unarchive" link', () => {
      cy.contains('Unarchive').should('be.visible')
    })

    it('should display the "About" details container', () => {
      assertSummaryTable({
        dataAutoId: 'aboutDetailsContainer',
        heading: 'About Archived Ltd',
        showEditLink: false,
        content: {
          'Business type': 'Company',
          'Trading names': 'Not set',
          'Annual turnover': '£33.5M+',
          'Number of employees': '500+',
          'Website': 'Not set',
        },
      })
    })

    it('should display the "Addresses" details container', () => {
      assertSummaryTable({
        dataAutoId: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: false,
      })
    })

    it('should display the address', () => {
      assertAddress({
        address: [
          '16 Getabergsvagen',
          'Geta',
          '22340',
          'Malta',
        ],
        registeredAddress: [
          '16 Getabergsvagen',
          'Geta',
          '22340',
          'Malta',
        ],
      })
    })

    it('should not display the "DIT region" details container', () => {
      cy.get(selectors.detailsContainer('regionDetailsContainer').container).should('not.exist')
    })

    it('should display the "DIT sector" details container', () => {
      assertSummaryTable({
        dataAutoId: 'sectorDetailsContainer',
        heading: 'DIT sector',
        showEditLink: false,
        content: ['Retail'],
      })
    })

    it('should display the "Global Account Manager - One List" details container', () => {
      assertSummaryTable({
        dataAutoId: 'oneListDetailsContainer',
        heading: 'Global Account Manager – One List',
        showEditLink: false,
        content: {
          'One List tier': 'Tier A - Strategic Account',
          'Global Account Manager': 'Travis GreeneIST - Sector Advisory ServicesLondon',
        },
      })
    })

    it('should display the "Business hierarchy" details container', () => {
      assertSummaryTable({
        dataAutoId: 'businessHierarchyDetailsContainer',
        heading: 'Business hierarchy',
        showEditLink: false,
        content: {
          'Headquarter type': 'Global HQ',
          'Subsidiaries': '1 subsidiary',
        },
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
      cy.visit(`/companies/${fixtures.company.minimallyMinimalLtd.id}/business-details2`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.minimallyMinimalLtd.name]: `/companies/${fixtures.company.minimallyMinimalLtd.id}`,
        'Business details': null,
      })
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

    it('should display the "About" details container', () => {
      assertSummaryTable({
        dataAutoId: 'aboutDetailsContainer',
        heading: 'About Minimally Minimal Ltd',
        showEditLink: true,
        content: {
          'Trading names': 'Not set',
          'Annual turnover': 'Not set',
          'Number of employees': 'Not set',
          'Website': 'Not set',
        },
      })
    })

    it('should display the "Addresses" details container', () => {
      assertSummaryTable({
        dataAutoId: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: true,
      })
    })

    it('should display the address', () => {
      assertAddress({
        address: [
          'United Kingdom',
        ],
        registeredAddress: null,
      })
    })

    it('should display the "DIT region" details container', () => {
      assertSummaryTable({
        dataAutoId: 'regionDetailsContainer',
        heading: 'DIT region',
        showEditLink: true,
        content: ['Not set'],
      })
    })

    it('should display the "DIT sector" details container', () => {
      assertSummaryTable({
        dataAutoId: 'sectorDetailsContainer',
        heading: 'DIT sector',
        showEditLink: true,
        content: ['Advanced Engineering'],
      })
    })

    it('should not display the "Global Account Manager - One List" details container heading', () => {
      cy.get(selectors.detailsContainer('oneListDetailsContainer').container).should('not.exist')
    })

    it('should display the "Business hierarchy" details container', () => {
      assertSummaryTable({
        dataAutoId: 'businessHierarchyDetailsContainer',
        heading: 'Business hierarchy',
        showEditLink: true,
        content: {
          'Global HQ': 'NoneLink to the Global HQ',
        },
      })
    })

    it('should not display the "Documents from CDMS" details container', () => {
      cy.get(selectors.detailsContainer('documentsDetailsContainer').container).should('not.exist')
    })

    it('should display the "Archive company" details container', () => {
      cy.get(selectors.detailsContainer('archiveCompanyContainer').container).should('be.visible')
    })
  })
})
