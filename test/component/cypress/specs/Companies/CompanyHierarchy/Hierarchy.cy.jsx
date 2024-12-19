import React from 'react'

import { kebabCase } from 'lodash'

import { Hierarchy } from '../../../../../../src/client/modules/Companies/CompanyHierarchy/CompanyTree'
import {
  companyTreeFaker,
  companyTreeItemFaker,
} from '../../../../../functional/cypress/fakers/dnb-hierarchy'

import urls from '../../../../../../src/lib/urls'
import { hqLabels } from '../../../../../../src/apps/companies/labels'
import {
  rgb,
  DARK_BLUE_LEGACY,
} from '../../../../../../src/client/utils/colours'
import {
  formatDate,
  DATE_FORMAT_COMPACT,
} from '../../../../../../src/client/utils/date-utils'

const {
  company: { dnbGlobalUltimate, allOverviewDetails },
} = require('../../../../../functional/cypress/fixtures')

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

const companyNoUkRegion = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
      uk_region: null,
    }),
    ultimate_global_companies_count: 1,
    family_tree_companies_count: 1,
  },
})

const companyOnlyImmediateSubsidiaries = companyTreeFaker({})
const companyWith10LevelsOfSubsidiaries = companyTreeFaker({
  treeDepth: 10,
  minCompaniesPerLevel: 3,
  maxCompaniesPerLevel: 4,
})

const companyNoAdditionalTagData = companyTreeFaker({
  globalCompany: {
    ultimate_global_company: companyTreeItemFaker({
      id: dnbGlobalUltimate.id,
      number_of_employees: null,
      one_list_tier: [],
      uk_region: null,
      address: null,
      trading_names: [],
      headquarter_type: null,
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

const companyOnlyImmediateSubsidiariesCompanyName = kebabCase(
  companyOnlyImmediateSubsidiaries.ultimate_global_company.name
)

const companyWithAllDetailsCompanyName = kebabCase(allOverviewDetails.name)

const companyNoUkRegionCompanyName = kebabCase(
  companyNoUkRegion.ultimate_global_company.name
)

describe('D&B Company Tree Hierarchy component', () => {
  context('When a company has no related records', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyNoRelatedRecords}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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

    it('should hide the add to Data Hub link', () => {
      cy.get('[data-test="add-company-"]').should('not.exist')
    })
  })

  context('When a company has no subsidiaries', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyNoSubsidiaries}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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
    const subsidiaryCompanyName = kebabCase(
      companyOnlyImmediateSubsidiaries.ultimate_global_company.subsidiaries[0]
        .name
    )
    const subsidiaryTagContent =
      companyOnlyImmediateSubsidiaries.ultimate_global_company.subsidiaries[0]
    companyOnlyImmediateSubsidiaries.ultimate_global_company.is_out_of_business = true

    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyOnlyImmediateSubsidiaries}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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
        .get('[data-test="company-name-header"]')
        .first()
        .should(
          'contain.text',
          `${companyOnlyImmediateSubsidiaries.ultimate_global_company.name} (not on Data Hub)`
        )

      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-number-of-employees-tag]`
      ).should(
        'contain.text',
        companyOnlyImmediateSubsidiaries.ultimate_global_company
          .number_of_employees
      )
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-uk-region-tag]`
      ).should(
        'contain.text',
        companyOnlyImmediateSubsidiaries.ultimate_global_company.uk_region.name
      )
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-out-of-business]`
      ).should('contain.text', 'Out of business')
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
    })

    it('should show the expected tags', () => {
      cy.get(
        `[data-test=${subsidiaryCompanyName}-number-of-employees-tag]`
      ).should('contain.text', subsidiaryTagContent.number_of_employees)
      cy.get(`[data-test=${subsidiaryCompanyName}-uk-region-tag]`).should(
        'contain.text',
        subsidiaryTagContent.uk_region.name
      )
      cy.get(`[data-test=${subsidiaryCompanyName}-one-list-tag]`).should(
        'contain.text',
        subsidiaryTagContent.one_list_tier.name.slice(0, 6)
      )
      cy.get(
        `[data-test=${subsidiaryCompanyName}-headquarter-type-tag]`
      ).should(
        'contain.text',
        hqLabels[subsidiaryTagContent.headquarter_type.name]
      )
      cy.get(`[data-test=${subsidiaryCompanyName}-out-of-business]`).should(
        'not.exist'
      )
    })
  })

  context('When a company has no additional company information', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyNoAdditionalTagData}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

    it('should not show any tag information', () => {
      cy.get(`[data-test=requested-company`)
        .children()
        .find('strong')
        .should('not.exist')

      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-number-of-employees-tag]`
      ).should('not.exist')
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-uk-region-tag]`
      ).should('not.exist')
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-country-tag]`
      ).should('not.exist')
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-one-list-tag]`
      ).should('not.exist')
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-headquarter-type-tag]`
      ).should('not.exist')
    })

    it('should not show any trading names', () => {
      const company = companyNoAdditionalTagData.ultimate_global_company
      cy.get(`[data-test="${kebabCase(company.name)}-trading-names"]`).should(
        'not.exist'
      )
    })
  })

  context('When a company has subsidiaries not on Data Hub', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyWithLinkedSubsidiaryNotInDataHub}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

    it('should have a link to add the company to Data Hub', () => {
      cy.get('[data-test="expand-tree-button"]').click()
      cy.get(`[data-test=add-company-not-on-data-hub-ltd`).should(
        'have.attr',
        'href',
        urls.companies.create() + '?duns_number=123456789'
      )
    })
  })
  context('When a company has a large number of subsidiaries', () => {
    beforeEach(() => {
      const companyWith5LevelsOfSubsidiaries = companyTreeFaker({
        treeDepth: 5,
      })

      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyWith5LevelsOfSubsidiaries}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

    it('should expand all levels when the expand button is clicked', () => {
      cy.get('[data-test="hierarchy-item"]').eq(0).should('be.visible')
      cy.get('[data-test="hierarchy-item"]').eq(4).should('not.be.visible')
      cy.get('[data-test="expand-tree-button"]')
        .click()
        .should('have.attr', 'aria-expanded', 'true')

      cy.get('[data-test="hierarchy-item"]').should('be.visible')
    })

    it('should collapse all levels when the expand button is clicked again', () => {
      cy.get('[data-test="hierarchy-item"]').should('be.visible')
      cy.get('[data-test="expand-tree-button"]')
        .click()
        .should('have.attr', 'aria-expanded', 'true')
        .click()
        .should('have.attr', 'aria-expanded', 'false')
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

    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyWith10LevelsOfSubsidiaries}
          requestedCompanyId={middleCompany.id}
        />
      )
    })

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
      cy.isScrolledTo(`[data-test-id="${middleCompany.id}"]`)
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
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyManuallyLinkedSubsidiary}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyNoSubsidiaries}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

    it('should display with a different background colour to other items', () => {
      cy.get('[data-test="requested-company"]')
        .first()
        .should('have.css', 'background-color', rgb(DARK_BLUE_LEGACY))
    })
  })

  context('When a company has a mix of known and unknown subsidiaries', () => {
    const formattedDate = formatDate(
      companyManuallyLinkedSubsidiaries.ultimate_global_company.subsidiaries[0]
        .latest_interaction_date,
      DATE_FORMAT_COMPACT
    )

    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyManuallyLinkedSubsidiaries}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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
      beforeEach(() => {
        cy.mountWithProvider(
          <Hierarchy
            familyTree={companyManuallyLinkedSubsidiaries}
            requestedCompanyId={dnbGlobalUltimate.id}
          />
        )
      })

      it('should have correct text in button', () => {
        cy.get('[data-test="expand-tree-button"]')
          .should('exist')
          .contains('Show all')
      })

      it('should show header with count of ultimate global and manually linked companies', () => {
        cy.get('[data-test="hierarchy-contents"]').should('exist').contains('7')
      })
    }
  )

  context('When a company has a reduced company tree', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={reducedTreeCompanyTree}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

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

  context('When a company only has UK region and a country set', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyOnlyImmediateSubsidiaries}
          requestedCompanyId={allOverviewDetails.id}
        />
      )
    })

    it('should only display the UK region tag', () => {
      cy.get(
        `[data-test=${companyOnlyImmediateSubsidiariesCompanyName}-uk-region-tag]`
      ).should(
        'have.text',
        `${companyOnlyImmediateSubsidiaries.ultimate_global_company.uk_region.name}, UK`
      )
      cy.get(
        `[data-test=${companyWithAllDetailsCompanyName}-country-tag]`
      ).should('not.exist')
    })
  })

  context('When a company only has country and no Uk region set', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <Hierarchy
          familyTree={companyNoUkRegion}
          requestedCompanyId={dnbGlobalUltimate.id}
        />
      )
    })

    it('should only display the country tag', () => {
      cy.get(`[data-test=${companyNoUkRegionCompanyName}-country-tag]`).should(
        'have.text',
        `${companyNoUkRegion.ultimate_global_company.address.country.name}`
      )
      cy.get(
        `[data-test=${companyNoUkRegionCompanyName}-uk-region-tag]`
      ).should('not.exist')
    })
  })
})
