import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformInvestmentToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertMetadataItems,
  assertProjectKindLabel,
  assertText,
} from '../../../support/activity-assertions'
import {
  CONTACT_1,
  CONTACT_2,
  CREATED_BY,
  CREATED_ON,
} from '../../../support/activity-constants'

const NAME = 'An investment project'
const PROJECT_URL = urls.investments.projects.details('2')
const EL_DATE = '2023-12-01'

const buildAndMountActivity = (
  showOptionalFields,
  clientContacts = [],
  type = 'FDI'
) => {
  const activity = {
    date: CREATED_ON,
    investment: {
      id: '2',
      created_by: CREATED_BY,
      name: NAME,
      client_contacts: clientContacts,
      estimated_land_date: EL_DATE,
      foreign_equity_investment: showOptionalFields ? 123456789 : '',
      gross_value_added: showOptionalFields ? 12345 : '',
      investment_type: {
        name: type,
      },
      number_new_jobs: showOptionalFields ? 1 : '',
      total_investment: showOptionalFields ? 1234567890 : '',
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformInvestmentToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Investment project activity card', () => {
  context('When the card is rendered with a complete FDI project', () => {
    beforeEach(() => {
      buildAndMountActivity(true, [CONTACT_1])
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertInvestmentLabels()
      assertActivitySubject(NAME, PROJECT_URL)
      assertMetadataItems([
        'Created on 25 Nov 2058',
        'Investment type FDI',
        'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Estimated land date 1 Dec 2023',
        'Company contact Alexander Hamilton',
        'Total investment £1,234,567,890',
        'Capital expenditure value £123,456,789',
        'Gross value added (GVA) £12,345',
        'Number of jobs 1',
      ])
    })
  })
  context(
    'When the card is rendered with a complete project with multiple client contacts',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true, [CONTACT_1, CONTACT_2])
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          'Created on 25 Nov 2058',
          'Investment type FDI',
          'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          'Estimated land date 1 Dec 2023',
          'Company contacts Alexander Hamilton, Oliver Twist',
          'Total investment £1,234,567,890',
          'Capital expenditure value £123,456,789',
          'Gross value added (GVA) £12,345',
          'Number of jobs 1',
        ])
      })
    }
  )
  context('When the card is rendered with an incomplete project', () => {
    beforeEach(() => {
      buildAndMountActivity(false)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should only render the mandatory fields', () => {
      assertInvestmentLabels()
      assertActivitySubject(NAME, PROJECT_URL)
      assertMetadataItems([
        'Created on 25 Nov 2058',
        'Investment type FDI',
        'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Estimated land date 1 Dec 2023',
      ])
    })
  })

  context('When the card is rendered with a Non-FDI project', () => {
    beforeEach(() => {
      buildAndMountActivity(false, [], 'Non-FDI')
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should only render the mandatory fields', () => {
      assertInvestmentLabels('Non-FDI')
      assertActivitySubject(NAME, PROJECT_URL)
      assertMetadataItems([
        'Created on 25 Nov 2058',
        'Investment type Non-FDI',
        'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Estimated land date 1 Dec 2023',
      ])
    })
  })

  context(
    'When the card is rendered with a Commitment to Invest project',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false, [], 'Commitment to invest')
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Commitment to invest')
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          'Created on 25 Nov 2058',
          'Investment type Commitment to invest',
          'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          'Estimated land date 1 Dec 2023',
        ])
      })
    }
  )
})

const assertInvestmentLabels = (investmentType = 'FDI') => {
  assertText('[data-test="investment-theme-label"]', 'Investment')
  assertText(
    '[data-test="investment-type-label"]',
    `Project - ${investmentType}`
  )
  assertProjectKindLabel()
}
