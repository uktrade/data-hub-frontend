import { investments } from '../../../../../src/lib/urls'
import fixture from '../../fixtures/investment/investment-needing-external-funding.json'
import { collectionListRequest } from '../../support/actions'
import { getCollectionList } from '../../support/collection-list-assertions'
import { companyFaker } from '../../fakers/companies'
import { formatMediumDateTime } from '../../../../../src/client/utils/date'

describe('Edit the recipient company', () => {
  context('When searching for a recipient company', () => {
    const company = companyFaker({
      modified_on: '1953-02-21T21:43:57.0Z',
      sector: { name: 'example sector' },
    })

    before(() => {
      collectionListRequest(
        'v4/search/company',
        [company],
        investments.projects.recipientCompany(fixture.id)
      )
    })
    beforeEach(() => {
      getCollectionList()
      cy.get('[data-test="metadata-item"]').as('metadataItems')
    })

    it('should render the potential recipient company information correctly', () => {
      cy.get('@firstListItem')
        .should('contain', company.name)
        .find('a')
        .should(
          'have.attr',
          'href',
          investments.projects.editRecipientCompany(fixture.id, company.id)
        )
      cy.get('h4').should(
        'contain',
        `Updated on ${formatMediumDateTime(company.modified_on)}`
      )
      cy.get('@metadataItems')
        .eq(0)
        .should('contain', `Sector ${company.sector.name}`)
      cy.get('@metadataItems')
        .eq(1)
        .should(
          'contain',
          `Address ${company.address.line_1}, ${company.address.line_2}, ${company.address.town}, ${company.address.county}, ${company.address.postcode}`
        )
    })
    it('should link the recipient company and redirect back to the details page', () => {
      cy.get('@firstListItem').find('a').click()
      cy.url().should('contain', investments.projects.details(fixture.id))
    })
  })
})
