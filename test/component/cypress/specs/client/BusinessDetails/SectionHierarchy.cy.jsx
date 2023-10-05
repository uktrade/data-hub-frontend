import React from 'react'

import SectionHierarchy from '../../../../../../src/apps/companies/apps/business-details/client/SectionHierarchy'
import { companyFaker } from '../../../../../functional/cypress/fakers/companies'
import urls from '../../../../../../src/lib/urls'
import DataHubProvider from '../../provider'
import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'

const HIERARCHY_STRINGS = {
  dnbDescription:
    'This hierarchy information from Dun & Bradstreet cannot be edited.',
  dnbEmpty: 'This company is not related to any other company records.',
  manualHierarchyDescription:
    'This hierarchy information is manually recorded (linked) by Data Hub users. This means it can be different from the Dun & Bradstreet hierarchy, which in the future will replace this manually recorded information.',
}

describe('Section hierarchy', () => {
  const Component = (props) => (
    <DataHubProvider>
      <SectionHierarchy {...props} />
    </DataHubProvider>
  )

  context(
    'When viewing business details for a Dun & Bradstreet company with a global ultimate',
    () => {
      const globalUltimateCompany = companyFaker()

      it('the table should show all expected values', () => {
        cy.mount(
          <Component
            company={globalUltimateCompany}
            isDnbCompany={true}
            dnbRelatedCompaniesCount={5}
          />
        )

        cy.get('[data-test="company-tree-link"]')
          .contains('other company records')
          .should(
            'have.attr',
            'href',
            urls.companies.dnbHierarchy.tree(globalUltimateCompany.id)
          )
      })
    }
  )

  context(
    'when viewing business details for a Data Hub company on the One List in the UK',
    () => {
      const oneListCompany = companyFaker({
        globalHeadquarters: companyFaker(),
      })

      it('the table should show all expected values', () => {
        cy.mount(<Component company={oneListCompany} />)

        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: true,
          content: {
            [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
            'Global HQ': oneListCompany.globalHeadquarters.name + 'Remove link',
          },
        })
      })
    }
  )
  context(
    'when viewing business details for a Dun & Bradstreet company not on the One List',
    () => {
      it('the table should show all expected values', () => {
        cy.mount(<Component company={companyFaker()} isDnbCompany={true} />)

        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: false,
          content: [
            HIERARCHY_STRINGS.dnbDescription,
            HIERARCHY_STRINGS.dnbEmpty,
          ],
        })
      })
    }
  )

  context(
    'when viewing business details for an archived Data Hub company',
    () => {
      const archivedCompany = companyFaker({
        headquarterType: {
          name: 'ghq',
          id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
        },
      })

      it('the table should show all expected values', () => {
        cy.mount(
          <Component
            company={archivedCompany}
            dnbRelatedCompaniesCount={2}
            subsidiariesCount={2}
            isArchived={true}
          />
        )

        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: false,
          content: {
            [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
            'Headquarter type': 'Global HQ',
            Subsidiaries: '2 subsidiaries',
          },
        })
      })
    }
  )

  context(
    'when viewing business details for a company with minimal data',
    () => {
      it('the table should show all expected values', () => {
        cy.mount(<Component company={companyFaker()} />)

        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: true,
          content: {
            [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
            'Global HQ': 'NoneLink to the Global HQ',
          },
        })
      })
    }
  )

  context(
    'when viewing business details for a Dun & Bradstreet GHQ company on the One List not in the UK',
    () => {
      const company = companyFaker({
        headquarterType: {
          name: 'ghq',
          id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
        },
      })

      it('the table should show all expected values', () => {
        cy.mount(
          <Component
            company={company}
            isDnbCompany={true}
            subsidiariesCount={2}
          />
        )

        assertSummaryTable({
          dataTest: 'businessHierarchyDetailsContainer',
          heading: 'Business hierarchy',
          showEditLink: true,
          content: {
            [HIERARCHY_STRINGS.dnbDescription]: null,
            [HIERARCHY_STRINGS.dnbEmpty]: null,
            [HIERARCHY_STRINGS.manualHierarchyDescription]: null,
            'Headquarter type': 'Global HQ',
            Subsidiaries: '2 subsidiaries',
          },
        })
      })
    }
  )
})
