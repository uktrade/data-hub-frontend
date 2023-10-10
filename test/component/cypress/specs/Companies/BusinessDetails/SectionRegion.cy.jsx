import React from 'react'

import DataHubProvider from '../../provider'
import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'

const {
  default: SectionRegion,
} = require('../../../../../../src/apps/companies/apps/business-details/client/SectionRegion')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

describe('Section region', () => {
  const Component = (props) => (
    <DataHubProvider>
      <SectionRegion {...props} />
    </DataHubProvider>
  )

  const companyWithRegion = companyFaker({
    ukRegion: {
      name: 'London',
      id: '874cd12a-6095-e211-a939-e4115bead28a',
    },
    ukBased: true,
  })

  const companyWithoutRegion = companyFaker({ ukRegion: null })

  context('when viewing business details for a company with a region', () => {
    it('should display the "DBT region" details container', () => {
      cy.mount(<Component company={companyWithRegion} />)

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
      cy.mount(<Component company={companyWithoutRegion} />)

      cy.get('[data-test="region-details-container"]').should('not.exist')
    })
  })

  context(
    'when viewing business details for a company that is archived',
    () => {
      it('should not display edit link', () => {
        cy.mount(<Component company={companyWithRegion} isArchived={true} />)

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
