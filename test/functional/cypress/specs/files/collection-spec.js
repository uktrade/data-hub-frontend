import {
  assertListLength,
  assertSummaryCardTitle,
  assertSummaryCardLinks,
  assertSummaryCardList,
  assertMultipleAddItemButtons,
  assertMultipleAddItemButtonsText,
} from '../../support/collection-list-assertions'
import { assertUrl } from '../../support/assertions'
import urls, { companies } from '../../../../../src/lib/urls'
import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'

import { companyFaker } from '../../fakers/companies'
import {
  sharePointDocumentFaker,
  uploadableDocumentFaker,
} from '../../fakers/generic-documents'
import { VIRUS_SCAN_STATUSES } from '../../../../../src/client/modules/Investments/Projects/constants'

describe('Generic Documents / Files Collections for company', () => {
  const company = companyFaker({ id: '4cd4128b-1bad-4f1e-9146-5d4678c6a018' })
  const genericDocumentList = [
    sharePointDocumentFaker(),
    uploadableDocumentFaker({
      document: { status: VIRUS_SCAN_STATUSES.virusScanned.label },
    }),
  ]
  const sharePointDocumentIndex = 0
  const uploadableDocumentIndex = 1
  const sharePointDocument = genericDocumentList[sharePointDocumentIndex]
  const uploadableDocument = genericDocumentList[uploadableDocumentIndex]

  const interceptApiRequest = () => {
    cy.intercept(
      'GET',
      `/api-proxy/v4/document/?related_object_id=${company.id}*`,
      {
        body: {
          count: genericDocumentList.length,
          results: genericDocumentList,
        },
      }
    ).as('apiRequest')
  }

  beforeEach(() => {
    interceptApiRequest()
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company).as(
      'companyRequest'
    )
    cy.visit(companies.files.index(company.id), {
      qs: { sortby: '-created_on' },
    })
    cy.wait(['@companyRequest', '@apiRequest'])

    // Extract specific collection items
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems')
      .eq(sharePointDocumentIndex)
      .as('sharePointDocument')
    cy.get('@collectionItems')
      .eq(uploadableDocumentIndex)
      .as('uploadableDocument')
  })

  it('should display a list of generic documents / files', () => {
    assertListLength(genericDocumentList)
  })

  it('should render the correct amount of add item buttons', () => {
    assertMultipleAddItemButtons(2)
  })

  it('should render the add item buttons with the correct text', () => {
    assertMultipleAddItemButtonsText(0, 'Upload file')
    assertMultipleAddItemButtonsText(1, 'Add SharePoint link')
  })

  context('SharePoint type documents / files', () => {
    it('should render the correct elements', () => {
      assertSummaryCardTitle(
        '@sharePointDocument',
        `SharePoint link - ${sharePointDocument.document.title}`
      )
      assertSummaryCardLinks('@sharePointDocument', ['View file', 'Delete'])
      assertSummaryCardList('@sharePointDocument', [
        [
          'Date added',
          formatDate(
            sharePointDocument.document.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          ),
        ],
        ['Added by', sharePointDocument.created_by.name],
        ['SharePoint url', sharePointDocument.document.url],
      ])
    })

    it('should link to the delete confirmation page url', () => {
      cy.get('@sharePointDocument').within(() => {
        cy.get('span').eq(1).should('contain', 'Delete').click()
      })
      assertUrl(companies.files.delete(sharePointDocument.id))
    })
  })

  context('Uploadable type documents / files', () => {
    it('should render the correct elements', () => {
      assertSummaryCardTitle(
        '@uploadableDocument',
        `Uploaded file - ${uploadableDocument.document.title}`
      )
      assertSummaryCardLinks('@uploadableDocument', ['Download', 'Delete'])
      assertSummaryCardList('@uploadableDocument', [
        [
          'Date added',
          formatDate(
            uploadableDocument.document.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          ),
        ],
        ['Added by', uploadableDocument.created_by.name],
      ])
    })

    it('should have a download link that opens in a new tab', () => {
      const downloadURL = `https://example.com/download/${uploadableDocument.id}`
      cy.intercept(
        'GET',
        urls.companies.files.download(uploadableDocument.id),
        {
          statusCode: 200,
          body: {
            document_url: downloadURL,
          },
        }
      ).as('downloadRequest')

      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen')
      })

      cy.get('@uploadableDocument').within(() => {
        cy.get('[data-test="file-download-link"]').click()
      })
      cy.wait('@downloadRequest')
      cy.get('@windowOpen').should('have.been.calledOnce')
      cy.get('@windowOpen').should(
        'have.been.calledWith',
        downloadURL,
        '_blank',
        'noopener noreferrer'
      )
    })

    it('should show different download link text based on document status', () => {
      const statusToTest = Object.entries(VIRUS_SCAN_STATUSES).filter(
        ([key]) => key !== 'virusScanned'
      )
      statusToTest.forEach(([statusKey, statusObj]) => {
        const uploadableDocumentWithStatus = uploadableDocumentFaker({
          document: {
            title: `${statusKey} File`,
            status: statusObj.label,
          },
        })
        cy.intercept(
          'GET',
          `/api-proxy/v4/document/?related_object_id=${company.id}*`,
          {
            body: {
              count: 1,
              results: [uploadableDocumentWithStatus],
            },
          }
        ).as('apiRequest')
        cy.visit(companies.files.index(company.id), {
          qs: { sortby: '-created_on' },
        })
        cy.wait(['@companyRequest', '@apiRequest'])

        const expectedText = statusObj.display || statusObj.label

        cy.get('[data-test="collection-item"]').as('collectionItems')
        cy.get('@collectionItems')
          .eq(0)
          .within(() => {
            if (typeof expectedText === 'string') {
              cy.contains(expectedText).should('exist')
            }
            cy.get('[data-test="file-download-link"]').should('not.exist')
          })
      })
    })

    it('should link to the delete confirmation page url', () => {
      cy.get('@uploadableDocument').within(() => {
        cy.get('span').eq(1).should('contain', 'Delete').click()
      })
      assertUrl(companies.files.delete(uploadableDocument.id))
    })
  })
})
