import {
  getCollectionList,
  assertListLength,
  assertSummaryCardTitle,
  assertSummaryCardLinks,
  assertSummaryCardList,
  assertMultipleAddItemButtons,
} from '../../support/collection-list-assertions'
import { companies } from '../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'
import { companyFaker } from '../../fakers/companies'
import { genericDocumentsListFaker } from '../../fakers/generic-documents'

describe('Generic Documents / Files Collections for company', () => {
  const company = companyFaker()
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
    interceptApiRequest()
    cy.visit(companies.files(company.id), {
      qs: { sortby: '-created_on' },
    })
    cy.wait('@apiRequest')
    getCollectionList()
  })

  it('should display a list of generic documents / files', () => {
    assertListLength(genericDocumentsList)
  })

  it('should display multiple buttons', () => {
    assertMultipleAddItemButtons('Upload file', 'Add SharePoint link')
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

  context('SharePoint type documents / files sorting', () => {
    it('should render the elements sorted correctly', () => {})
  })
})
