import React from 'react'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'
import { UK_REGIONS } from '../../../../../../src/common/constants'

const {
  default: SectionRegion,
} = require('../../../../../../src/client/modules/Companies/CompanyBusinessDetails/SectionRegion')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

describe('Section region', () => {
  const companyWithRegion = companyFaker({
    ukRegion: {
      name: 'London',
      id: UK_REGIONS.LONDON,
    },
    ukBased: true,
  })

  const companyWithoutRegion = companyFaker({ ukRegion: null })

  context('when viewing business details for a company with a region', () => {
    it('should display the "DBT region" details container', () => {
      cy.mountWithProvider(<SectionRegion company={companyWithRegion} />)

      assertSummaryTable({
        dataTest: 'regionDetailsContainer',
        heading: 'DBT region',
        showEditLink: true,
        content: [companyWithRegion.ukRegion.name],
      })
    })
  })

  context('when viewing business details for a company with no region', () => {
    it('should not display the "DBT region" details container', () => {
      cy.mountWithProvider(<SectionRegion company={companyWithoutRegion} />)

      cy.get('[data-test="region-details-container"]').should('not.exist')
    })
  })

  context(
    'when viewing business details for a company that is archived',
    () => {
      it('should not display edit link', () => {
        cy.mountWithProvider(
          <SectionRegion company={companyWithRegion} isArchived={true} />
        )

        assertSummaryTable({
          dataTest: 'regionDetailsContainer',
          heading: 'DBT region',
          showEditLink: false,
          content: [companyWithRegion.ukRegion.name],
        })
      })
    }
  )
})
