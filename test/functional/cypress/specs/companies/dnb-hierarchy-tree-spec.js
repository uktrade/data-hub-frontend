import {
  companyTreeFaker,
  companyTreeItemFaker,
} from '../../fakers/dnb-hierarchy'
import { kebabCase } from 'lodash'

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
  },
})

const companyNoSubsidiaries = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
    }),
    ultimate_global_companies_count: 1,
  },
})

const companyOnlyImmediateSubsidiaries = companyTreeFaker({})
const companyWith5LevelsOfSubsidiaries = companyTreeFaker({ treeDepth: 5 })
const companyName = kebabCase(
  companyOnlyImmediateSubsidiaries.ultimate_global_company.subsidiaries[0].name
)
const tagContent =
  companyOnlyImmediateSubsidiaries.ultimate_global_company.subsidiaries[0]

const companyNoAdditionalTagData = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
      number_of_employees: null,
      one_list_tier: [],
      uk_region: null,
      address: null,
    }),
    ultimate_global_companies_count: 1,
  },
})

const assertRelatedCompaniesPage = ({ company }) => {
  it('should render the header', () => {
    assertLocalHeader(`Company records related to ${company.name}`)
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard(),
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
          assertErrorDialog('TASK_GET_DNB_FAMILY_TREE', 'Not Found')
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

  context('When a company has no related recods', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyNoRelatedRecords
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })

    it('should only show a single item with not found message', () => {
      cy.get('[data-test="hierarchy-item"]').should('have.length', 1)
      cy.get('[data-test="related-company"]')
        .should('be.visible')
        .should('contain.text', 'No related companies found')
    })

    it('should hide the show all companies button', () => {
      cy.get('[data-test="expand-tree-button"]').should('not.exist')
    })

    it('should hide the show subsidiaries button', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').should('not.exist')
    })
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

    it('should only show a single company item with the requested company style', () => {
      cy.get('[data-test="hierarchy-item"]').should('have.length', 1)
      cy.get('[data-test="requested-company"]').should('be.visible')
    })

    it('should hide the show all companies button', () => {
      cy.get('[data-test="expand-tree-button"]').should('not.exist')
    })

    it('should hide the show subsidiaries button', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').should('not.exist')
    })
  })

  context('When a company has only immediate subsidiaries', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyOnlyImmediateSubsidiaries
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })

    it('should display the global company with a show subsidiaries button', () => {
      cy.get('[data-test="hierarchy-item"]').should('have.length', 2)
      cy.get('[data-test="toggle-subsidiaries-button"]')
        .should('exist')
        .should('have.length', 1)
    })

    it('should display the show all companies button', () => {
      cy.get('[data-test="expand-tree-button"]').should('exist')
    })

    it('should display the global company with the correct company details', () => {
      cy.get('[data-test="hierarchy-item"]')
        .first()
        .find('span')
        .first()
        .should(
          'contain.text',
          `${companyOnlyImmediateSubsidiaries.ultimate_global_company.name} (not on Data Hub)`
        )
      cy.get(`[data-test=${companyName}-number-of-employees-tag]`).should(
        'contain.text',
        tagContent.number_of_employees
      )
      cy.get(`[data-test=${companyName}-uk-region-tag]`).should(
        'contain.text',
        tagContent.uk_region.name
      )
    })

    it('should click the show subsidiaries button and check the subsidiary company displays with the correct company details', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').click()
      cy.get('[data-test="hierarchy-item"]')
        .eq(1)
        .find('a')
        .should(
          'have.text',
          companyOnlyImmediateSubsidiaries.ultimate_global_company
            .subsidiaries[0].name
        )
        .should(
          'have.attr',
          'href',
          urls.companies.overview.index(
            companyOnlyImmediateSubsidiaries.ultimate_global_company
              .subsidiaries[0].id
          )
        )

      cy.get(`[data-test=${companyName}-number-of-employees-tag]`).should(
        'contain.text',
        tagContent.number_of_employees
      )
      cy.get(`[data-test=${companyName}-uk-region-tag]`).should(
        'contain.text',
        tagContent.uk_region.name
      )
      cy.get(`[data-test=${companyName}-country-tag]`).should(
        'contain.text',
        tagContent.address.country.name
      )
      cy.get(`[data-test=${companyName}-one-list-tag]`).should(
        'contain.text',
        tagContent.one_list_tier.name.slice(0, 6)
      )
    })
  })

  context('When a company has no additional company information', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyNoAdditionalTagData
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    it('should not show any tag information', () => {
      cy.get(`[data-test=requested-company`)
        .children()
        .find('strong')
        .should('not.exist')

      cy.get(`[data-test=${companyName}-number-of-employees-tag]`).should(
        'not.exist'
      )
      cy.get(`[data-test=${companyName}-uk-region-tag]`).should('not.exist')
      cy.get(`[data-test=${companyName}-country-tag]`).should('not.exist')
      cy.get(`[data-test=${companyName}-one-list-tag]`).should('not.exist')
    })
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

    it('should expand all levels when the expand button is clicked', () => {
      cy.get('[data-test="hierarchy-item"]').eq(0).should('be.visible')
      cy.get('[data-test="hierarchy-item"]').eq(4).should('not.be.visible')
      cy.get('[data-test="expand-tree-button"]').click()
      cy.get('[data-test="hierarchy-item"]').should('be.visible')
    })

    it('should collapse all levels when the expand button is clicked again', () => {
      cy.get('[data-test="hierarchy-item"]').should('be.visible')
      cy.get('[data-test="expand-tree-button"]').click()
      cy.get('[data-test="hierarchy-item"]').eq(0).should('be.visible')
      cy.get('[data-test="hierarchy-item"]').eq(4).should('not.be.visible')
    })
  })
})
