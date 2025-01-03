import React from 'react'

import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'

const {
  default: SectionAbout,
} = require('../../../../../../src/client/modules/Companies/CompanyBusinessDetails/SectionAbout')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

describe('Section about', () => {
  const companyWithDetails = companyFaker({
    businessType: {
      name: 'Company',
      id: '98d14e94-5d95-e211-a939-e4115bead28a',
    },
    vatNumber: '12345',
    tradingNames: ['Venus company'],
    referenceCode: 'ORG-10096257',
    companyNumber: '12345678',
    dunsNumber: '987654321',
    turnoverGbp: '1000000',
    numberOfEmployees: '5',
    website: 'www.example.com',
    exportSegment: 'hep',
    exportSubSegment: 'sustain_nurture_and_grow',
    description: 'This is a dummy company for testing',
  })

  const companyWithMinimalDetails = companyFaker({
    website: null,
    description: null,
  })

  context(
    'when viewing business details for a Data Hub company with about data',
    () => {
      it('should display the "About" details container', () => {
        cy.mountWithProvider(
          <SectionAbout company={companyWithDetails} isDnbCompany={false} />
        )

        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: `About ${companyWithDetails.name}`,
          showEditLink: true,
          content: {
            'VAT number': companyWithDetails.vatNumber,
            'Business type': companyWithDetails.businessType.name,
            'Trading name': companyWithDetails.tradingNames[0],
            'CDMS reference': companyWithDetails.referenceCode,
            'Companies House number':
              companyWithDetails.companyNumber +
              'View on Companies House website (opens in new tab)',
            'DUNS number': '987654321',
            'Annual turnover': '£1,000,000',
            'Number of employees': companyWithDetails.numberOfEmployees,
            Website: companyWithDetails.website + ' (opens in new tab)',
            'Business description': companyWithDetails.description,
            Segment: 'High export potential',
            'Sub-segment': 'Sustain: nurture & grow',
          },
        })
      })
    }
  )

  context(
    'when viewing business details for a Data Hub company with minimal data',
    () => {
      it('should display the "About" details container', () => {
        cy.mountWithProvider(
          <SectionAbout company={companyWithMinimalDetails} />
        )

        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: `About ${companyWithMinimalDetails.name}`,
          showEditLink: true,
          content: {
            'Trading name': 'Not set',
            'DUNS number': 'Not set',
            'Annual turnover': 'Not set',
            'Number of employees': 'Not set',
            Website: 'Not set',
            'Business description': 'No description has been added',
            Segment: 'No export segment or not known',
            'Sub-segment': 'No sub export segment or not known',
          },
        })
      })
    }
  )

  context(
    'when viewing business details for a Data Hub company that is archived',
    () => {
      it('should not display edit link', () => {
        cy.mountWithProvider(
          <SectionAbout company={companyWithMinimalDetails} isArchived={true} />
        )

        assertSummaryTable({
          dataTest: 'aboutDetailsContainer',
          heading: `About ${companyWithMinimalDetails.name}`,
          showEditLink: false,
          content: {
            'Trading name': 'Not set',
            'DUNS number': 'Not set',
            'Annual turnover': 'Not set',
            'Number of employees': 'Not set',
            Website: 'Not set',
            'Business description': 'No description has been added',
            Segment: 'No export segment or not known',
            'Sub-segment': 'No sub export segment or not known',
          },
        })
      })
    }
  )
})
