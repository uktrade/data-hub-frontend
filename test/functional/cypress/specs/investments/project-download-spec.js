import qs from 'qs'

import { investments } from '../../../../../src/lib/urls'
import { investmentProjectListFaker } from '../../fakers/investment-projects'
import { UK_REGIONS } from '../../../../../src/common/constants'

const downloadHeader = '[data-test="download-data-header"]'
const downloadButton = '[data-test="download-data-header"] a'
const apiEndpoint = '/api-proxy/v3/search/investment_project'

describe('Download CSV', () => {
  context('When there are 0 projects', () => {
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: [],
          count: 0,
        },
      })
      cy.visit(investments.projects.index())
    })
    it('should not render the download header', () => {
      cy.get(downloadHeader).should('not.exist')
    })
  })

  context('When there is a single project', () => {
    const investmentList = investmentProjectListFaker()
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: investmentList,
          count: investmentList.length,
        },
      })
      cy.visit(investments.projects.index())
    })

    it('should render the download header', () => {
      cy.get(downloadHeader).should('exist')
    })

    it('should render a download link', () => {
      cy.get(downloadButton)
        .should('exist')
        .should(
          'have.attr',
          'href',
          '/investments/projects/export?sortby=created_on%3Adesc'
        )
        .and('contain', 'Download')
    })

    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download this project'
      )
    })
  })

  context('When there are 4999 projects', () => {
    const investmentList = investmentProjectListFaker(9)
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: investmentList,
          count: 4999,
        },
      })
      cy.visit(investments.projects.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'You can now download these 4999 projects'
      )
    })
  })

  context('When there are 5000 projects', () => {
    const investmentList = investmentProjectListFaker(10)
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: investmentList,
          count: 5000,
        },
      })
      cy.visit(investments.projects.index())
    })
    it('should render a download message', () => {
      cy.get(downloadHeader).should(
        'contain',
        'Filter to fewer than 5,000 projects to download'
      )
    })
  })

  context('When each of the filters are applied', () => {
    const investmentList = investmentProjectListFaker(1)
    const filters = {
      stage: [
        '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
        'c9864359-fb1a-4646-a4c1-97d10189fc03',
      ],
      adviser: '73d89d55-68b2-4bb9-9c7c-eedbb1548b94',
      sector_descends: 'af959812-6095-e211-a939-e4115bead28a',
      country_investment_originates_from:
        '80756b9a-5d95-e211-a939-e4115bead28a',
      uk_region_location: UK_REGIONS.EAST_MIDLANDS,
      status: ['ongoing', 'delayed'],
      investment_type: '031269ab-b7ec-40e9-8a4e-7371404f0622',
      land_date_financial_year_start: '2021',
      likelihood_to_land: 'b3515282-dc36-487a-a5af-320cde165575',
      estimated_land_date_before: '2022-02',
      estimated_land_date_after: '2022-01',
      actual_land_date_before: '2022-02',
      actual_land_date_after: '2022-01',
      level_of_involvement_simplified: 'involved',
    }
    const queryString = qs.stringify(filters)
    beforeEach(() => {
      cy.intercept('POST', apiEndpoint, {
        body: {
          results: investmentList,
          count: investmentList.length,
        },
      })
      cy.visit(`${investments.projects.index()}?${queryString}`)
    })
    it('should have the correct query string', () => {
      cy.get(downloadButton).should(
        'have.attr',
        'href',
        `/investments/projects/export?${queryString}`
      )
    })
  })
})
