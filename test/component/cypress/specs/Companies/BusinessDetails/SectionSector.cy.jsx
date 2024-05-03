import React from 'react'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'

const {
  default: SectionSector,
} = require('../../../../../../src/client/modules/Companies/CompanyBusinessDetails/SectionSector')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

describe('Section sector', () => {
  const companyWithSector = companyFaker({
    sector: {
      name: 'Retail',
      id: '355f977b-8ac3-e211-a646-e4115bead28a',
    },
  })

  const companyWithoutSector = companyFaker({ sector: null })

  context('when viewing business details for a company with a sector', () => {
    it('should display the "DBT sector" details container', () => {
      cy.mountWithProvider(<SectionSector company={companyWithSector} />)

      assertSummaryTable({
        dataTest: 'sectorDetailsContainer',
        heading: 'DBT sector',
        showEditLink: true,
        content: ['Retail'],
      })
    })
  })

  context('when viewing business details for a company with no sector', () => {
    it('should display the "DBT sector" details container', () => {
      cy.mountWithProvider(<SectionSector company={companyWithoutSector} />)

      assertSummaryTable({
        dataTest: 'sectorDetailsContainer',
        heading: 'DBT sector',
        showEditLink: true,
        content: ['Not set'],
      })
    })
  })

  context(
    'when viewing business details for a company that is archived',
    () => {
      it('should not display edit link', () => {
        cy.mountWithProvider(
          <SectionSector company={companyWithSector} isArchived={true} />
        )

        assertSummaryTable({
          dataTest: 'sectorDetailsContainer',
          heading: 'DBT sector',
          showEditLink: false,
          content: ['Retail'],
        })
      })
    }
  )
})
