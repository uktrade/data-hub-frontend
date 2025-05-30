import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformInvestmentToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertEYBLabel,
  assertMetadataItems,
  assertNotEYBLabel,
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
const DEFAULT_CLIENT_CONTACTS = []
const DEAFAULT_PROJECT_TYPE = 'FDI'

const EYB_LEAD = [{ id: '1' }]
const EYB_LEADS = [{ id: '2' }, { id: '3' }, { id: '4' }]

const buildAndMountActivity = (
  showOptionalFields,
  clientContacts = DEFAULT_CLIENT_CONTACTS,
  type = DEAFAULT_PROJECT_TYPE,
  eybLeads = []
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
      eyb_leads: eybLeads,
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
  context(
    'When the card is rendered with a complete FDI project and no link to EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true, [CONTACT_1])
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertNotEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          { label: 'Company contact', value: 'Alexander Hamilton' },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a complete FDI project and one linked EYB lead',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          true,
          [CONTACT_1],
          DEAFAULT_PROJECT_TYPE,
          EYB_LEAD
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          { label: 'Company contact', value: 'Alexander Hamilton' },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a complete FDI project and multiple linked EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          true,
          [CONTACT_1],
          DEAFAULT_PROJECT_TYPE,
          EYB_LEADS
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          { label: 'Company contact', value: 'Alexander Hamilton' },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a complete project with multiple client contacts and no link to EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(true, [CONTACT_1, CONTACT_2])
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertNotEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          {
            label: 'Company contacts',
            value: 'Alexander Hamilton, Oliver Twist',
          },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a complete project with multiple client contacts and one EYB lead',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          true,
          [CONTACT_1, CONTACT_2],
          DEAFAULT_PROJECT_TYPE,
          EYB_LEAD
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          {
            label: 'Company contacts',
            value: 'Alexander Hamilton, Oliver Twist',
          },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a complete project with multiple client contacts and multiple EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          true,
          [CONTACT_1, CONTACT_2],
          DEAFAULT_PROJECT_TYPE,
          EYB_LEADS
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the labels and metadata', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
          {
            label: 'Company contacts',
            value: 'Alexander Hamilton, Oliver Twist',
          },
          { label: 'Total investment', value: '£1,234,567,890' },
          { label: 'Capital expenditure value', value: '£123,456,789' },
          { label: 'Gross value added (GVA)', value: '£12,345' },
          { label: 'Number of jobs', value: '1' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with an incomplete project and no link to EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels()
        assertNotEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with an incomplete project and one EYB lead',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          DEAFAULT_PROJECT_TYPE,
          EYB_LEAD
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with an incomplete project and multiple EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          DEAFAULT_PROJECT_TYPE,
          EYB_LEADS
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels()
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Non-FDI project and no link to EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(false, DEFAULT_CLIENT_CONTACTS, 'Non-FDI')
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Non-FDI')
        assertNotEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Non-FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Non-FDI project and one EYB lead',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          'Non-FDI',
          EYB_LEAD
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Non-FDI')
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Non-FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Non-FDI project and multiple EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          'Non-FDI',
          EYB_LEADS
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Non-FDI')
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Non-FDI' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Commitment to Invest project and no link to EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          'Commitment to invest'
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Commitment to invest')
        assertNotEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Commitment to invest' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Commitment to Invest project and one EYB lead',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          'Commitment to invest',
          EYB_LEAD
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Commitment to invest')
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Commitment to invest' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
        ])
      })
    }
  )

  context(
    'When the card is rendered with a Commitment to Invest project and multiple EYB leads',
    () => {
      beforeEach(() => {
        buildAndMountActivity(
          false,
          DEFAULT_CLIENT_CONTACTS,
          'Commitment to invest',
          EYB_LEADS
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should only render the mandatory fields', () => {
        assertInvestmentLabels('Commitment to invest')
        assertEYBLabel()
        assertActivitySubject(NAME, PROJECT_URL)
        assertMetadataItems([
          { label: 'Created on', value: '25 Nov 2058' },
          { label: 'Investment type', value: 'Commitment to invest' },
          {
            label: 'Added by',
            value:
              'Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
          },
          { label: 'Estimated land date', value: '1 Dec 2023' },
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
