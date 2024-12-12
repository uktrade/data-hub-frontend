import { investments } from '../../../../../src/lib/urls'
import fixture from '../../fixtures/investment/investment-needing-external-funding.json'
import { collectionListRequest } from '../../support/actions'
import { getCollectionList } from '../../support/collection-list-assertions'
import { investmentProjectFaker } from '../../fakers/investment-projects'
import {
  formatDate,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../../src/client/utils/date-utils'

describe('Edit the associated FDI R&D project', () => {
  context('When adding a new linked project', () => {
    const project = investmentProjectFaker({
      investment_type: { name: 'Non-FDI' },
    })

    before(() => {
      collectionListRequest(
        'v3/search/investment_project',
        [project],
        investments.projects.findAssociatedProject(fixture.id)
      )
      getCollectionList()
      cy.get('[data-test="metadata-item"]').as('metadataItems')
    })

    it('should render the potential associated project information correctly', () => {
      cy.get('@firstListItem')
        .should('contain', project.name)
        .find('a')
        .should(
          'have.attr',
          'href',
          investments.projects.editAssociatedProject(fixture.id, project.id)
        )
      cy.get('h4').should('contain', `Project code ${project.project_code}`)
      cy.get('@metadataItems')
        .eq(0)
        .should('contain', `Investor ${project.investor_company.name}`)
      cy.get('@metadataItems')
        .eq(1)
        .should('contain', `Sector ${project.sector.name}`)
      cy.get('@metadataItems')
        .eq(2)
        .should(
          'contain',
          `Estimated land date ${formatDate(
            project.estimated_land_date,
            DATE_FORMAT_MONTH_YEAR
          )}`
        )
    })
  })
})
