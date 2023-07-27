import { kebabCase } from 'lodash'
import { formatWithoutParsing } from '../../../../../src/client/utils/date'
import {
  companyTreeFaker,
  companyTreeItemFaker,
} from '../../fakers/dnb-hierarchy'
import { DARK_BLUE_LEGACY } from '../../../../../src/client/utils/colours'
import hexRgb from 'hex-rgb'

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
      trading_names: [],
    }),
    ultimate_global_companies_count: 1,
    family_tree_companies_count: 1,
  },
})

const companyWithLinkedSubsidiaryNotInDataHub = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
      number_of_employees: 123,
      one_list_tier: [],
      uk_region: null,
      address: null,
      subsidiaries: [
        {
          duns_number: '123456789',
          name: 'Not on Data Hub Ltd',
          number_of_employees: 13,
          hierarchy: 2,
        },
      ],
    }),
    ultimate_global_companies_count: 2,
    family_tree_companies_count: 2,
  },
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

    it('should display the total number of companies in the tree', () => {
      cy.get('[data-test="hierarchy-header"] > h2').should(
        'have.text',
        `${companyNoRelatedRecords.family_tree_companies_count} companies`
      )
    })

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

    it('should display the total number of companies in the tree', () => {
      cy.get('[data-test="hierarchy-header"] > h2').should(
        'have.text',
        `${companyNoSubsidiaries.family_tree_companies_count} company`
      )
    })

    it('should hide the show all companies button', () => {
      cy.get('[data-test="expand-tree-button"]').should('not.exist')
    })

    it('should hide the show subsidiaries button', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').should('not.exist')
    })

    it('should show trading names under heading', () => {
      const company = companyNoSubsidiaries.ultimate_global_company
      cy.get(`[data-test="${kebabCase(company.name)}-trading-names"]`).should(
        'have.text',
        `Trading as: ${company.trading_names}`
      )
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
        .find('div')
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

    it('should show trading names under heading', () => {
      const company = companyOnlyImmediateSubsidiaries.ultimate_global_company
      cy.get(`[data-test="${kebabCase(company.name)}-trading-names"]`).should(
        'have.text',
        `Trading as: ${company.trading_names}`
      )
    })

    it('should click the show subsidiaries button and check the subsidiary company displays with the correct company details', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').click()
      cy.get('[data-test="hierarchy-item"]')
        .eq(1)
        .find('a')
        .should(
          'contain.text',
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

    it('should not show any trading names', () => {
      const company = companyNoAdditionalTagData.ultimate_global_company
      cy.get(`[data-test="${kebabCase(company.name)}-trading-names"]`).should(
        'not.exist'
      )
    })
  })

  context('When a company has subsidiaries not on Data Hub', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        companyWithLinkedSubsidiaryNotInDataHub
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    it('should have a link to add the company to Data Hub', () => {
      cy.get('[data-test="expand-tree-button"]').click()
      cy.get(`[data-test=add-not-on-data-hub-ltd`).click()
      cy.location().should((loc) => {
        expect(loc.search).to.eq('?duns_number=123456789')
      })
      cy.go('back')
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

    it('all parent levels should be expanded', () => {
      cy.get(`[data-test-id="${middleCompany.id}"]`).should(
        'have.attr',
        'aria-expanded',
        'false'
      )

      cy.get('[data-test="hierarchy-item"]')
        .filter(':lt(4)')
        .each((item) =>
          cy.wrap(item).should('have.attr', 'aria-expanded', 'true')
        )
    })

    it('should auto scroll to the item', () => {
      cy.isInViewport(`[data-test-id="${middleCompany.id}"]`)
    })

    it('all other levels should be collapsed', () => {
      cy.get('[data-test="hierarchy-item"]')
        .filter(':gt(4)')
        .each((item) =>
          cy.wrap(item).should('have.attr', 'aria-expanded', 'false')
        )
    })
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

    it('should display a show/hide manually linked subsidiary button', () => {
      cy.get('[data-test="hierarchy-item"]').should('have.length', 3)
      cy.get('[data-test="hierarchy-item"]').eq(2).should('not.be.visible')
      cy.get('[data-test="manually-linked-hierarchy-container"]')
        .should('have.length', 1)
        .contains('Show 1 manually linked subsidiary')
        .click()
        .contains('Hide 1 manually linked subsidiary')
      cy.get('[data-test="hierarchy-item"]').eq(2).should('be.visible')
    })
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

    it('should display with a different background colour to other items', () => {
      cy.get('[data-test="requested-company"]')
        .first()
        .should(
          'have.css',
          'background-color',
          hexRgb(DARK_BLUE_LEGACY, { format: 'css' }).replaceAll(' ', ', ')
        )
    })
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

    const formattedDate = formatWithoutParsing(
      companyManuallyLinkedSubsidiaries.ultimate_global_company.subsidiaries[0]
        .latest_interaction_date
    )

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })

    it('should not display a View more detail link for companies not on Data Hub', () => {
      cy.get('[data-test="related-company"]')
        .first()
        .should('not.contain', 'View more detail')
    })

    it('should display a View more detail link for companies on Data Hub', () => {
      cy.get('[data-test="toggle-subsidiaries-button"]').first().click()
      cy.get('[data-test="related-company"]')
        .first()
        .next()
        .next()
        .contains('View more detail')
        .get('dl')
        .should('not.be.visible')
      cy.get('[data-test="toggle-section-button-content"]')
        .first()
        .click()
        .contains('Hide detail')
        .parent()
        .parent()
        .siblings('div')
        .first('dl')
        .should('be.visible')
        .should(
          'contain.text',
          `Trading address${companyManuallyLinkedSubsidiaries.ultimate_global_company.subsidiaries[0].address.line_1}`
        )
        .should(
          'contain.text',
          `Registered address${companyManuallyLinkedSubsidiaries.ultimate_global_company.subsidiaries[0].registered_address.line_1}`
        )
        .should('contain.text', `SectorNot set`)
        .should(
          'contain.text',
          `Employees${companyManuallyLinkedSubsidiaries.ultimate_global_company.subsidiaries[0].number_of_employees}`
        )
        .should('contain.text', `Last interaction date${formattedDate}`)
    })
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

      it('should have correct count of ultimate global companies in button', () => {
        cy.get('[data-test="expand-tree-button"]').should('exist').contains('2')
      })

      it('should show header with count of ultimate global and manually linked companies', () => {
        cy.get('[data-test="hierarchy-contents"]').should('exist').contains('7')
      })
    }
  )

  context('When a company has a reduced companytree', () => {
    before(() => {
      cy.intercept(
        `api-proxy/v4/dnb/${dnbGlobalUltimate.id}/family-tree`,
        reducedTreeCompanyTree
      ).as('treeApi')
      cy.visit(urls.companies.dnbHierarchy.tree(dnbGlobalUltimate.id))
      cy.wait('@treeApi')
    })

    assertRelatedCompaniesPage({ company: dnbGlobalUltimate })

    it('should have display a message about this being a reduced company tree', () => {
      cy.get('[data-test="reduced-tree-hierarchy"]').should('exist')
    })

    it('should display the total number of companies in the tree compared to the overall global count', () => {
      cy.get('[data-test="hierarchy-header"] > h2').should(
        'have.text',
        `${reducedTreeCompanyTree.family_tree_companies_count} companies out of ${reducedTreeCompanyTree.ultimate_global_companies_count}`
      )
    })
  })
})
