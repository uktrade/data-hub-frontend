import React from 'react'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'
import { UK_REGIONS } from '../../../../../../src/common/constants'

const {
  default: SectionOneList,
} = require('../../../../../../src/client/modules/Companies/CompanyBusinessDetails/SectionOneList')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

describe('Section region', () => {
  const oneListCompany = companyFaker({
    oneListGroupGlobalAccountManager: {
      name: 'Travis Greene',
      firstName: 'Travis',
      lastName: 'Greene',
      contactEmail: 'travis@example.net',
      ditTeam: {
        name: 'IST - Sector Advisory Services',
        ukRegion: {
          name: 'London',
          id: UK_REGIONS.LONDON,
        },
        country: {
          name: 'United Kingdom',
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
        },
        id: 'fc3a6667-cfe9-e511-8ffa-e4115bead28a',
      },
      id: '8eefe6b4-2816-4e47-94b5-a13409dcef70',
    },
    oneListGroupTier: {
      name: 'Tier A - Strategic Account',
      id: 'b91bf800-8d53-e311-aef3-441ea13961e2',
    },
  })

  const notOneListCompany = companyFaker()

  context('when viewing business details for a one list company', () => {
    it('should display the "Global Account Manager - One List" details container', () => {
      cy.mountWithProvider(<SectionOneList company={oneListCompany} />)

      assertSummaryTable({
        dataTest: 'oneListDetailsContainer',
        heading: 'Global Account Manager – One List',
        showEditLink: true,
        content: {
          'One List tier': 'Tier A - Strategic Account',
          'Global Account Manager':
            'Travis GreeneIST - Sector Advisory ServicesLondon',
        },
      })
    })
  })

  context(
    'when viewing business details for a company that is not one list',
    () => {
      it('should not display the "Global Account Manager - One List" details container', () => {
        cy.mountWithProvider(<SectionOneList company={notOneListCompany} />)

        cy.get('[data-test="one-list-details-container"]').should('not.exist')
      })
    }
  )

  context(
    'when viewing business details for a one list company that is archived',
    () => {
      it('should not display edit link', () => {
        cy.mountWithProvider(
          <SectionOneList company={oneListCompany} isArchived={true} />
        )

        assertSummaryTable({
          dataTest: 'oneListDetailsContainer',
          heading: 'Global Account Manager – One List',
          showEditLink: false,
          content: {
            'One List tier': 'Tier A - Strategic Account',
            'Global Account Manager':
              'Travis GreeneIST - Sector Advisory ServicesLondon',
          },
        })
      })
    }
  )
})
