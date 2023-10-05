import {
  companyTreeFaker,
  companyTreeItemFaker,
} from '../../fakers/dnb-hierarchy'

const {
  assertErrorDialog,
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

const urls = require('../../../../../src/lib/urls')

const {
  company: { dnbGlobalUltimate },
} = require('../../fixtures')

const companyNoRelatedRecords = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: {},
    ultimate_global_companies_count: 0,
    family_tree_companies_count: 0,
  },
})

const companyNoSubsidiaries = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
    }),
    ultimate_global_companies_count: 1,
    family_tree_companies_count: 1,
  },
})

const companyOnlyImmediateSubsidiaries = companyTreeFaker({})
const companyWith5LevelsOfSubsidiaries = companyTreeFaker({ treeDepth: 5 })
const companyWith10LevelsOfSubsidiaries = companyTreeFaker({
  treeDepth: 10,
  minCompaniesPerLevel: 3,
  maxCompaniesPerLevel: 4,
})

const companyManuallyLinkedSubsidiary = companyTreeFaker({
  mannualVerifiedSubsidiariesCount: 1,
})

const companyManuallyLinkedSubsidiaries = companyTreeFaker({
  mannualVerifiedSubsidiariesCount: 5,
})

const reducedTreeCompanyTree = companyTreeFaker({})
reducedTreeCompanyTree.reduced_tree = true
reducedTreeCompanyTree.ultimate_global_companies_count = 15000

const assertRelatedCompaniesPage = ({ company }) => {
  it('should render the header', () => {
    assertLocalHeader(`Company records related to ${company.name}`)
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.overview.index(company.id),
      'Business details': urls.companies.businessDetails(company.id),
      'Related companies': null,
    })
  })
}

describe('D&B Company hierarchy tree', () => {
  context('Error scenarios:', () => {
    context(
      'when attempting to view the hierarchy of an unknown company',
      () => {
        const unknownId = 1
        before(() => {
          cy.intercept(`api-proxy/v4/company/${unknownId}`, {
            statusCode: 404,
          }).as('companyApi')
          cy.visit(urls.companies.dnbHierarchy.tree(unknownId))
        })
        it('should display the access denied page', () => {
          cy.wait('@companyApi')
          assertErrorDialog('TASK_GET_COMPANY_DETAIL', 'Not Found')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a company without a D&B id',
      () => {
        const accessDeniedId = 2
        before(() => {
          cy.intercept(`api-proxy/v4/company/${accessDeniedId}`, {
            id: accessDeniedId,
            duns_number: null,
          }).as('companyApi')
          cy.visit(urls.companies.dnbHierarchy.tree(accessDeniedId))
        })

        it('should display the access denied page', () => {
          cy.wait('@companyApi')
          cy.get('[data-test="access-denied"]').should('be.visible')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a known company and the family tree api errors',
      () => {
        before(() => {
          cy.intercept(`api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`, {
            statusCode: 404,
          }).as('familyTreeApi')
          cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
        })

        it('should display the error message', () => {
          cy.wait('@familyTreeApi')
          cy.get('[data-test="company-tree-loaded-error"]').should('be.visible')
        })
      }
    )

    context(
      'when attempting to view the hierarchy of a known company and the family tree api returns no data',
      () => {
        before(() => {
          cy.intercept(`api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`, {
            body: {},
          }).as('familyTreeApi')
          cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
        })

        it('should display the empty tree message', () => {
          cy.wait('@familyTreeApi')
          cy.get('[data-test="empty-hierarchy"]').should('be.visible')
        })
      }
    )
  })

  context('When a company has no related records', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyNoRelatedRecords
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company has no subsidiaries', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyNoSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company has only immediate subsidiaries', () => {
    before(() => {
      companyOnlyImmediateSubsidiaries.ultimate_global_company.is_out_of_business = true
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyOnlyImmediateSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company has a large number of subsidiaries', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyWith5LevelsOfSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When the requested company is in the middle of a tree', () => {
    const getCompanyAtLevel = (ultimate, level) => {
      let startLevel = 1
      let company = ultimate
      while (startLevel !== level) {
        company = company.subsidiaries[0]
        startLevel++
      }
      return company
    }

    const middleCompany = getCompanyAtLevel(
      companyWith10LevelsOfSubsidiaries.ultimate_global_company,
      5
    )

    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${middleCompany.id}/family-tree`,
        companyWith10LevelsOfSubsidiaries
      ).as('treeApi')
      cy.intercept(
        `api-proxy/v4/company/${middleCompany.id}`,
        dnbGlobalUltimate
      ).as('company')
      cy.visit(`${urls.companies.dnbHierarchy.tree(middleCompany.id)}`)
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company has manually linked subsidiary', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyManuallyLinkedSubsidiary
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company is the requested company', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyNoSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context('When a company has a mix of known and unknown subsidiaries', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyManuallyLinkedSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })

  context(
    'When a company has both verified and manually linked subsidiaries',
    () => {
      before(() => {
        cy.intercept(
          `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
          companyManuallyLinkedSubsidiaries
        ).as('treeApi')
        cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
        cy.wait('@treeApi')
      })

      assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
    }
  )

  context('When a company has a reduced company tree', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        reducedTreeCompanyTree
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })
  })
})
