import React from 'react'

import { CompanyLocalHeader } from '../../../../../src/client/components'
import { assertCompanyBreadcrumbs } from '../../../../functional/cypress/support/assertions'
import urls from '../../../../../src/lib/urls'
import { companyFaker } from '../../../../functional/cypress/fakers/companies'
import { contactFaker } from '../../../../functional/cypress/fakers/contacts'
import {
  UNITED_KINGDOM_ID,
  UNITED_STATES_ID,
} from '../../../../../src/common/constants'

const dnbGlobalUltAddress =
  '1700 Amphitheatre Way, Mountain Range, 95543-1771, United States'
const dnbInvestigationAddress =
  'Unit 10, Ockham Drive, GREENFORD, UB6 0F2, United Kingdom'
const archivedAddress = '16 Getabergsvagen, Geta, 22340, Malta'
const archiveMessage =
  'This company was archived on 06 Jul 2018 by John Rogers.'

const accountManagementUrl = (id) => urls.companies.accountManagement.index(id)
const addInteractionUrl = (id) => urls.companies.interactions.create(id)
const detailsUrl = (id) => urls.companies.detail(id)
const exportProjectUrl = (id) => urls.exportPipeline.create(id)

const dnbGlobalUltimate = companyFaker({
  address: {
    line1: '1700 Amphitheatre Way',
    line2: '',
    town: 'Mountain Range',
    county: '',
    postcode: '95543-1771',
    country: {
      id: UNITED_STATES_ID,
      name: 'United States',
    },
  },
  tradingNames: ['DnB Global Ultimate'],
  archived: false,
  isGlobalUltimate: true,
  oneListGroupTier: {
    name: 'Tier A - Strategic Account',
    id: 'b91bf800-8d53-e311-aef3-441ea13961e2',
  },
  oneListGroupGlobalAccountManager: contactFaker({
    name: 'Travis Greene',
  }),
  pendingDnbInvestigation: false,
  isGlobalHeadquarters: false,
})

const dnbUnderInvestigation = companyFaker({
  address: {
    line1: 'Unit 10, Ockham Drive',
    line2: '',
    town: 'GREENFORD',
    county: '',
    postcode: 'UB6 0F2',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  tradingNames: [],
  archived: false,
  isGlobalUltimate: false,
  oneListGroupTier: null,
  oneListGroupGlobalAccountManager: null,
  pendingDnbInvestigation: true,
  isGlobalHeadquarters: false,
})

const archivedCompany = companyFaker({
  address: {
    line1: '16 Getabergsvagen',
    line2: '',
    town: 'Geta',
    county: '',
    postcode: '22340',
    country: {
      name: 'Malta',
      id: '0850bdb8-5d95-e211-a939-e4115bead28a',
    },
  },
  tradingNames: ['Archived', 'A.R. Chived'],
  archived: true,
  isGlobalUltimate: false,
  oneListGroupTier: {
    name: 'Tier A - Strategic Account',
    id: 'b91bf800-8d53-e311-aef3-441ea13961e2',
  },
  oneListGroupGlobalAccountManager: contactFaker({
    name: 'Travis Greene',
  }),
  pendingDnbInvestigation: false,
  isGlobalHeadquarters: true,
  archivedOn: '2018-07-06T10:44:56Z',
  archivedReason: 'Company is dissolved',
  archivedBy: {
    name: 'John Rogers',
    firstName: 'John',
    lastName: 'Rogers',
  },
  headquarterType: {
    name: 'ghq',
    id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
  },
})

const breadcrumbTest = (company) => {
  it('should render the breadcrumbs', () => {
    assertCompanyBreadcrumbs(
      company.name,
      detailsUrl(company.id),
      'Test breadcrumb'
    )
  })
}

const companyNameTest = (companyName) => {
  it('should display the company name', () => {
    cy.get('[data-test="heading"]').should('contain', companyName)
  })
}

const companyAddressTest = (address) => {
  it('should display the company address', () => {
    cy.get('[data-test="address"]').contains(address)
  })
}

const addInteractionButtonTest = (id) => {
  it('should display the Add Interaction button', () => {
    cy.get('[data-test="header-add-interaction"]').should(
      'have.attr',
      'href',
      addInteractionUrl(id)
    )
  })
}

const addExportProjectButtonTest = (id) => {
  it('should display the Add Export Project button', () => {
    cy.get('[data-test="header-add-export-project"]').should(
      'have.attr',
      'href',
      exportProjectUrl(id)
    )
  })
}

const badgeTest = (badgeText) => {
  it(`should display a ${badgeText} badge`, () => {
    cy.get('[data-test="badge"]').should('contain', badgeText)
  })
}

const descriptionTest = (id) => {
  it('should display the correct description', () => {
    cy.get('[data-test="description"] p:nth-child(1)').contains(
      'This is an account managed company (One List Tier A - Strategic Account)'
    )

    cy.get('[data-test="description"] p:nth-child(2)')
      .contains('Global Account Manager: Travis Greene View core team')
      .contains('View core team')
      .should('have.attr', 'href', accountManagementUrl(id))
  })
}

const assertItemDoesNotExist = (item) => {
  cy.get(`[data-test="${item}"]`).should('not.exist')
}

describe('CompanyLocalHeader', () => {
  context('Local header for a DNB global ultimate company', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <CompanyLocalHeader
          breadcrumbs={[{ text: 'Test breadcrumb' }]}
          company={dnbGlobalUltimate}
          dnbRelatedCompaniesCount={12345}
          returnUrl={null}
        />
      )
    })

    breadcrumbTest(dnbGlobalUltimate)
    companyNameTest(dnbGlobalUltimate.name)

    it('should display the company trading name', () => {
      cy.get('[data-test="trading-names"]').contains(
        dnbGlobalUltimate.tradingNames[0]
      )
    })

    companyAddressTest(dnbGlobalUltAddress)

    addInteractionButtonTest(dnbGlobalUltimate.id)
    addExportProjectButtonTest(dnbGlobalUltimate.id)
    badgeTest('Ultimate HQ')

    it('should display "What does Ultimate HQ mean?" details', () => {
      cy.get('[data-test="ultimate-hq-details"]')
        .should('contain', 'What does Ultimate HQ mean?')
        .should(
          'contain',
          `This HQ is in control of all related company records for ${dnbGlobalUltimate.name}`
        )
    })

    descriptionTest(dnbGlobalUltimate.id)

    it('should not display the archive panel', () => {
      assertItemDoesNotExist('archive-panel')
    })

    it('should not display the pending investigation message', () => {
      assertItemDoesNotExist('investigation-message')
    })
  })

  context('Local header for a company under DNB investigation', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <CompanyLocalHeader
          breadcrumbs={[{ text: 'Test breadcrumb' }]}
          company={dnbUnderInvestigation}
          dnbRelatedCompaniesCount={null}
          returnUrl={null}
        />
      )
    })

    breadcrumbTest(dnbUnderInvestigation)

    it('should not display the archive panel', () => {
      assertItemDoesNotExist('archive-panel')
    })

    companyNameTest(dnbUnderInvestigation.name)

    it('should not display any trading names', () => {
      assertItemDoesNotExist('trading-names')
    })

    companyAddressTest(dnbInvestigationAddress)

    it('should not display the view related companies link', () => {
      assertItemDoesNotExist('company-tree-link')
    })

    addInteractionButtonTest(dnbUnderInvestigation.id)
    addExportProjectButtonTest(dnbUnderInvestigation.id)

    it('should not display a badge', () => {
      assertItemDoesNotExist('badge')
    })

    it('should not display the Ultimate HQ details', () => {
      assertItemDoesNotExist('ultimate-hq-details')
    })

    it('should not display any description', () => {
      assertItemDoesNotExist('description')
    })

    it('should display the pending investigation message', () => {
      cy.get('[data-test="investigation-message"]').contains(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      )
    })
  })

  context('Local header for an archived company', () => {
    beforeEach(() => {
      cy.viewport(1024, 768)
      cy.mountWithProvider(
        <CompanyLocalHeader
          breadcrumbs={[{ text: 'Test breadcrumb' }]}
          company={archivedCompany}
          dnbRelatedCompaniesCount={null}
          returnUrl={null}
        />
      )
    })

    breadcrumbTest(archivedCompany)

    companyNameTest(archivedCompany.name)

    it('should display multiple trading names', () => {
      cy.get('[data-test="trading-names"]').should(
        'have.text',
        'Trading as: Archived, A.R. Chived'
      )
    })

    companyAddressTest(archivedAddress)

    it('should not display the view related companies link', () => {
      assertItemDoesNotExist('company-tree-link')
    })

    addInteractionButtonTest(archivedCompany.id)
    addExportProjectButtonTest(archivedCompany.id)

    badgeTest('Global HQ')

    it('should not display the Ultimate HQ details', () => {
      assertItemDoesNotExist('ultimate-hq-details')
    })

    descriptionTest(archivedCompany.id)

    it('should display the archive message', () => {
      cy.get('[data-test="archive-message"]')
        .should('exist')
        .contains(archiveMessage)
      cy.get('[data-test="archive-reason"]')
        .should('exist')
        .contains('Reason: Company is dissolved')
      cy.get('[data-test="unarchive-link"]').contains('Unarchive')
    })

    it('should not display the pending investigation message', () => {
      assertItemDoesNotExist('investigation-message')
    })
  })
})
