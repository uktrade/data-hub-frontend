import {
  getCollectionList,
  assertListLength,
  assertSummaryCardTitle,
  assertSummaryCardLinks,
  assertSummaryCardList,
  assertMultipleAddItemButtons,
  assertMultipleAddItemButtonsText,
  assertAddItemButton,
} from '../../support/collection-list-assertions'
import { assertUrl } from '../../support/assertions'
import { companies } from '../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'

import { companyFaker } from '../../fakers/companies'
import { genericDocumentsListFaker } from '../../fakers/generic-documents'

describe('Generic Documents / Files Collections for company', () => {
  const company = companyFaker({
    id: '4cd4128b-1bad-4f1e-9146-5d4678c6a018',
    archived: true,
    archived_on: '2017-03-14T14:49:17',
    archived_by: 'Sam Smith',
    archived_reason: 'Left job',
  })
  const genericDocumentsList = [...genericDocumentsListFaker(3)]
  const apiUrl = `/api-proxy/v4/document/?related_object_id=${company.id}&limit=10&offset=0&sortby=-created_on`

  // Helper function to intercept the API request
  const interceptApiRequest = () => {
    cy.intercept('GET', apiUrl, {
      body: {
        count: genericDocumentsList.length,
        results: genericDocumentsList,
      },
    }).as('apiRequest')
  }

  beforeEach(() => {
    const linkUrl = `/api-proxy/v4/company/${company.id}`
    interceptApiRequest()
    cy.intercept('GET', linkUrl, company).as('companyRequest')
    cy.visit(companies.files.index(company.id), {
      qs: { sortby: '-created_on' },
    })
    cy.wait(['@companyRequest', '@apiRequest'])
    getCollectionList()
  })

  it('should display a list of generic documents / files', () => {
    assertListLength(genericDocumentsList)
  })

  context('SharePoint header buttons', () => {
    it('if url not set, return page url', () => {
      // Should button not be shown if no url is set?
      assertAddItemButton(
        'Add SharePoint link',
        companies.files.index(company.id)
      )
    })

    it('should render the correct amount of buttons', () => {
      assertMultipleAddItemButtons(1)
    })

    it('should render buttons with the correct text', () => {
      assertMultipleAddItemButtonsText(0, 'Add SharePoint link')
    })
  })

  context('SharePoint type documents / files', () => {
    it('should render the correct elements', () => {
      assertSummaryCardTitle(
        '@firstListItem',
        `SharePoint link - ${genericDocumentsList[0].document.title}`
      )
      assertSummaryCardLinks('@firstListItem', ['View file', 'Delete'])

      assertSummaryCardList('@firstListItem', [
        [
          'Date added',
          formatDate(
            genericDocumentsList[0].document.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          ),
        ],
        ['Added by', genericDocumentsList[0].created_by.name],
        ['SharePoint url', genericDocumentsList[0].document.url],
      ])
    })

    it('should link to the delete confirmation page url', () => {
      cy.get('@firstListItem').within(() => {
        cy.get('span').eq(1).should('contain', 'Delete').click()
      })
      assertUrl(companies.files.delete(genericDocumentsList[0].id))
    })
  })

  context('SharePoint type documents / files sorting', () => {
    it('should render the elements sorted correctly', () => {})
  })
})
