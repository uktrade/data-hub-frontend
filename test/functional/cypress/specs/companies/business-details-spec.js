const {
  assertSummaryTable,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const HIERARCHY_STRINGS = {
  dnbDescription:
    'This hierarchy information from Dun & Bradstreet cannot be edited.',
  dnbEmpty: 'This company is not related to any other company records.',
  manualHierarchyDescription:
    'This hierarchy information is manually recorded (linked) by Data Hub users. This means it can be different from the Dun & Bradstreet hierarchy, which in the future will replace this manually recorded information.',
}

const assertAddresses = ({ address, registeredAddress }) => {
  if (registeredAddress == null) {
    registeredAddress = address
    address = null
  }

  assertAddress(address, 'Trading')
  assertAddress(registeredAddress, 'Registered')
}

function assertAddress(address, type) {
  const selector = `[data-test="addresses${type}"]`
  if (address) {
    cy.get(selector).parent().contains(type).should('exist')
    address.map((line, index) => {
      cy.get(selector)
        .find(`li:nth-child(${index + 1})`)
        .should('have.text', line)
    })
  } else if (address === null) {
    cy.get(selector).should('not.exist')
  }
}

const assertAddressDefaultsToRegistered = () => {
  cy.get(`[data-test="addressesRegistered"]`)
    .parent()
    .contains('Registered')
    .should('exist')
  cy.get(`[data-test="addressesTrading"]`).should('not.exist')
}

const assertBusinessDetailsBreadcrumbs = (company) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Business details': null,
    })
  })
}

const assertLastUpdatedParagraph = (date) => {
  const paragraphText = 'Last updated on: ' + date
  it('should display the "Last updated" paragraph', () => {
    cy.contains(paragraphText).should('be.visible')
  })
}

const assertAreDetailsRight = () => {
  it('should display the "Are these business details right?" details summary', () => {
    cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
      'be.visible'
    )
  })
}

const assertAreDetailsRightNotVisible = () => {
  it('should not display the "Are these business details right?" details summary', () => {
    cy.get(selectors.companyBusinessDetails().whereDoesInformation).should(
      'not.exist'
    )
  })
}

const assertUnarchiveLinkNotVisible = () => {
  it('should not display the "Unarchive" link', () => {
    cy.get(selectors.companyBusinessDetails().unarchiveLink).should('not.exist')
  })
}

const assertAddressContainer = (showEdit) => {
  it('should display the "Addresses" details container', () => {
    assertSummaryTable({
      dataTest: 'addressesDetailsContainer',
      heading: 'Addresses',
      showEditLink: showEdit,
    })
  })
}

const assertRegionContainerNotVisible = () => {
  it('should not display the "DBT region" details container', () => {
    cy.get(
      selectors.detailsContainer('regionDetailsContainer').container
    ).should('not.exist')
  })
}

const assertSectorContainer = (showLink, content = ['Retail']) => {
  it('should display the "DBT sector" details container', () => {
    assertSummaryTable({
      dataTest: 'sectorDetailsContainer',
      heading: 'DBT sector',
      showEditLink: showLink,
      content: content,
    })
  })
}

const assertAccountManagerContainer = (showLink) => {
  it('should display the "Global Account Manager - One List" details container', () => {
    assertSummaryTable({
      dataTest: 'oneListDetailsContainer',
      heading: 'Global Account Manager – One List',
      showEditLink: showLink,
      content: {
        'One List tier': 'Tier A - Strategic Account',
        'Global Account Manager':
          'Travis GreeneIST - Sector Advisory ServicesLondon',
      },
    })
  })
}

const assertCDMSContainerNotVisible = () => {
  it('should not display the "Documents from CDMS" details container', () => {
    cy.get(
      selectors.detailsContainer('documentsDetailsContainer').container
    ).should('not.exist')
  })
}

const assertArchiveContainerNotVisible = () => {
  it('should not display the "Archive company" details container', () => {
    cy.get('[data-test=archive-company-container]').should('not.exist')
  })
}

const assertRegionContainer = (region) => {
  it('should display the "DBT region" details container', () => {
    assertSummaryTable({
      dataTest: 'regionDetailsContainer',
      heading: 'DBT region',
      showEditLink: true,
      content: region,
    })
  })
}

const assertHierarchyContainer = (showLink, content) => {
  it('should display the "Business hierarchy" details container', () => {
    assertSummaryTable({
      dataTest: 'businessHierarchyDetailsContainer',
      heading: 'Business hierarchy',
      showEditLink: showLink,
      content: content,
    })
  })
}

const assertArchiveContainerVisible = () => {
  it('should display the "Archive company" details container', () => {
    cy.get('[data-test=archive-company-container]').should('be.visible')
  })
}

const assertArchivePanelNotVisible = () => {
  it('should not render the archive panel', () => {
    cy.get('[data-test=archive-panel]').should('not.exist')
  })
}

describe('Companies business details', () => {
  context(
    'when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.oneListCorp.id)
        )
        it('should display the "Pending Change Request" text', () => {
          cy.contains('Checking for pending change requests')
        })
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.oneListCorp)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('26 Nov 2017')

      it('should not display the "Pending Change Request" box', () => {
        cy.contains(
          'Changes to these business details are currently being reviewed.'
        ).should('not.exist')
      })

      assertAreDetailsRight()
      assertUnarchiveLinkNotVisible()

      it('should display the "About" details container', () => {
        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: 'About One List Corp',
          showEditLink: true,
          content: {
            'Trading name': 'Not set',
            'Annual turnover': '£33.5M+',
            'Number of employees': '500+',
            Website: 'Not set',
            'Business description':
              'This is a dummy company for testing the One List',
            Segment: 'High export potential',
            'Sub-segment': 'Sustain: nurture & grow',
          },
        })
      })

      assertAddressContainer(false)

      it('should display the address', () => {
        assertAddresses({
          address: ["12 St George's Road", 'Paris', '75001', 'France'],
          registeredAddress: [
            "12 St George's Road",
            'Paris',
            '75001',
            'France',
          ],
        })
      })

      assertRegionContainerNotVisible()
      assertSectorContainer(true)
      assertAccountManagerContainer(false)

      it('should display the "Business hierarchy" details container heading', () => {
        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: true,
          content: {
            [HIERARCHY_STRINGS.dnbDescription]: null,
            [HIERARCHY_STRINGS.dnbEmpty]: null,
            [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
            'Headquarter type': 'Global HQ',
            Subsidiaries: 'NoneLink a subsidiary',
          },
        })
      })

      assertCDMSContainerNotVisible()
      assertArchiveContainerNotVisible()
    }
  )

  context(
    'when viewing business details for a Dun & Bradstreet company with a global ultimate',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.dnbGlobalUltimate.id)
        )
      })

      it('the card should link to the company tree page', () => {
        cy.get('[data-test="company-tree-link"]')
          .contains('other company records')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.companies.dnbHierarchy.tree(
            fixtures.company.dnbGlobalUltimate.id
          )
        )
        cy.go('back')
      })
    }
  )

  context(
    'when viewing business details for a US company with administrative area information',
    () => {
      before(() => {
        cy.visit(urls.companies.businessDetails(fixtures.company.usCompany.id))
      })

      it('should display the state in the address', () => {
        assertAddresses({
          address: [
            '12 First Street',
            'New York',
            '765413',
            'Texas',
            'United States',
          ],
          registeredAddress: [
            '12 First Street',
            'New York',
            '765413',
            'Texas',
            'United States',
          ],
        })
      })
    }
  )

  context(
    'when viewing business details for a Canadian company with administrative area information',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.canadianCompany.id)
        )
      })

      it('should display province in the address', () => {
        assertAddresses({
          address: [
            '12 Second Street',
            'Ottawa',
            '765413',
            'Ontario',
            'Canada',
          ],
          registeredAddress: [
            '12 Second Street',
            'Ottawa',
            '765413',
            'Ontario',
            'Canada',
          ],
        })
      })
    }
  )

  context(
    'when viewing business details for a Data Hub company on the One List in the UK',
    () => {
      before(() => {
        cy.visit(urls.companies.businessDetails(fixtures.company.venusLtd.id))
      })

      it('should not display the "Pending Change Request" text', () => {
        cy.contains('Checking for pending change requests').should('not.exist')
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.venusLtd)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('15 Jul 2016')
      assertAreDetailsRightNotVisible()
      assertUnarchiveLinkNotVisible()

      it('should display the "About" details container', () => {
        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: 'About Venus Ltd',
          showEditLink: true,
          content: {
            'Business type': 'Company',
            'Trading name': 'Not set',
            'CDMS reference': 'ORG-10096257',
            'Annual turnover': 'Not set',
            'Number of employees': 'Not set',
            Website: 'Not set',
            'Business description': 'This is a dummy company for testing',
            Segment: 'No export segment or not known',
            'Sub-segment': 'No sub export segment or not known',
          },
        })
      })

      assertAddressContainer(true)

      it('should display the address', () => {
        assertAddresses({
          address: ['66 Marcham Road', 'Bordley', 'BD23 8RZ', 'United Kingdom'],
          registeredAddress: [
            '66 Marcham Road',
            'Bordley',
            'BD23 8RZ',
            'United Kingdom',
          ],
        })
      })

      assertRegionContainer(['North West'])
      assertSectorContainer(true)
      assertAccountManagerContainer(true)
      assertHierarchyContainer(true, {
        [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
        'Global HQ': 'Archived LtdRemove link',
      })
      assertLastUpdatedParagraph('15 Jul 2016')
      assertArchiveContainerVisible()
    }
  )

  context(
    'when viewing business details for a Dun & Bradstreet company not on the One List',
    () => {
      before(() => {
        cy.visit(urls.companies.businessDetails(fixtures.company.dnbCorp.id))
        it('should display the "Pending Change Request" text', () => {
          cy.contains('Checking for pending change requests')
        })
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.dnbCorp)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('26 Oct 2018')
      assertAreDetailsRight()
      assertUnarchiveLinkNotVisible()

      it('should display the "About" details container', () => {
        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: 'About DnB Corp',
          showEditLink: true,
          content: {
            'Trading name': 'DnBD&B',
            'Annual turnover':
              '£720,000This is an estimated numberWhat does that mean?Actual turnover is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
            'Number of employees':
              '95This is an estimated numberWhat does that mean?Actual number of employees is not available for this business. The number has been modelled by Dun & Bradstreet, based on similar businesses.',
            Website: 'Not set',
            'Business description':
              'This is a dummy company for testing companies with DnB data',
            Segment: 'Not high export potential',
            'Sub-segment': 'Reassure: change the game',
          },
        })
      })

      assertAddressContainer(false)

      it('should display the address', () => {
        assertAddresses({
          address: ['1 Main Road', 'Rome', '001122', 'Italy'],
          registeredAddress: ['1 Main Road', 'Rome', '001122', 'Italy'],
        })
      })

      assertRegionContainerNotVisible()
      assertSectorContainer(true)

      it('should not display the "Global Account Manager - One List" details container', () => {
        cy.get(
          selectors.detailsContainer('oneListDetailsContainer').container
        ).should('not.exist')
      })

      assertHierarchyContainer(false, [
        HIERARCHY_STRINGS.dnbDescription,
        HIERARCHY_STRINGS.dnbEmpty,
      ])

      assertCDMSContainerNotVisible()
      assertArchiveContainerNotVisible()
    }
  )

  context(
    'when viewing business details for an automatically archived Data Hub company',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(
            fixtures.company.automaticallyArchivedLtd.id
          )
        )
      })

      it('should display it was automatically archived and the date', () => {
        cy.contains(
          'This company was automatically archived on 06 Jul 2018.'
        ).should('be.visible')
      })

      it('should display the reason it was archived', () => {
        cy.contains('Reason: Company is dissolved').should('be.visible')
      })
    }
  )

  context(
    'when viewing business details for an archived Data Hub company',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(fixtures.company.archivedLtd.id)
        )
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.archivedLtd)
      assertLastUpdatedParagraph('16 Jul 2017')
      assertAreDetailsRightNotVisible()

      it('should display the date the company was archived and by whom', () => {
        cy.contains(
          'This company was archived on 06 Jul 2018 by John Rogers'
        ).should('be.visible')
      })

      it('should display the reason it was dissolved', () => {
        cy.contains('Reason: Company is dissolved').should('be.visible')
      })

      it('should display the "Unarchive" link', () => {
        cy.contains('Unarchive').should('be.visible')
      })

      it('should display the "About" details container', () => {
        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: 'About Archived Ltd',
          showEditLink: false,
          content: {
            'Business type': 'Company',
            'Trading name': 'Not set',
            'Annual turnover': '£33.5M+',
            'Number of employees': '500+',
            Website: 'Not set',
            'Business description':
              'This is a dummy company for testing archived features',
            Segment: 'No export segment or not known',
            'Sub-segment': 'No sub export segment or not known',
          },
        })
      })

      assertAddressContainer(false)

      it('should display the address', () => {
        assertAddresses({
          address: ['16 Getabergsvagen', 'Geta', '22340', 'Malta'],
          registeredAddress: ['16 Getabergsvagen', 'Geta', '22340', 'Malta'],
        })
      })

      assertRegionContainerNotVisible()
      assertSectorContainer(false)
      assertAccountManagerContainer(false)
      assertHierarchyContainer(false, {
        [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
        'Headquarter type': 'Global HQ',
        Subsidiaries: '2 subsidiaries',
      })
      assertCDMSContainerNotVisible()
      assertArchiveContainerNotVisible()
    }
  )

  context(
    'when viewing business details for a company with minimal data',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(
            fixtures.company.minimallyMinimalLtd.id
          )
        )
      })

      assertBusinessDetailsBreadcrumbs(fixtures.company.minimallyMinimalLtd)
      assertArchivePanelNotVisible()
      assertLastUpdatedParagraph('11 Dec 2015')
      assertAreDetailsRightNotVisible()
      assertUnarchiveLinkNotVisible()

      it('should display the "About" details container', () => {
        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: 'About Minimally Minimal Ltd',
          showEditLink: true,
          content: {
            'Trading name': 'Not set',
            'Annual turnover': 'Not set',
            'Number of employees': 'Not set',
            Website: 'Not set',
            'Business description': 'No description has been added',
            Segment: 'No export segment or not known',
            'Sub-segment': 'No sub export segment or not known',
          },
        })
      })

      assertAddressContainer(true)

      it('should display the address', () => {
        assertAddresses({
          address: ['United Kingdom'],
          registeredAddress: null,
        })
      })

      assertRegionContainer(['Not set'])
      assertSectorContainer(true, ['Advanced Engineering'])

      it('should not display the "Global Account Manager - One List" details container heading', () => {
        cy.get(
          selectors.detailsContainer('oneListDetailsContainer').container
        ).should('not.exist')
      })

      assertHierarchyContainer(true, {
        [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
        'Global HQ': 'NoneLink to the Global HQ',
      })
      assertCDMSContainerNotVisible()
      assertArchiveContainerVisible()
    }
  )

  context(
    'when viewing business details for a company that has the address only',
    () => {
      before(() => {
        cy.visit(
          urls.companies.businessDetails(
            fixtures.company.minimallyMinimalLtd.id
          )
        )
      })

      it('should label address as registered address', () => {
        assertAddressDefaultsToRegistered()
      })
    }
  )
})
