import {
  getCollectionList,
  assertListLength,
  assertSummaryCardTitle,
  assertSummaryCardLinks,
  assertSummaryCardList,
} from '../../support/collection-list-assertions'
import { companies } from '../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'
import { genericDocumentsListFaker } from '../../fakers/generic-documents'

describe('Generic Documents / Files Collections for company', () => {
  const companyId = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
  const genericDocumentsList = [...genericDocumentsListFaker(3)]

  // Define the API URL once
  const apiUrl = `/api-proxy/v4/document/?related_object_id=${companyId}&limit=10&offset=0&sortby=created_on:desc`

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
    interceptApiRequest()
    cy.visit(companies.files(companyId), {
      qs: { sortby: 'created_on:desc' },
    })
    cy.wait('@apiRequest')
    getCollectionList()
  })

  it('should display a list of generic documents / files', () => {
    assertListLength(genericDocumentsList)
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
  })
})
