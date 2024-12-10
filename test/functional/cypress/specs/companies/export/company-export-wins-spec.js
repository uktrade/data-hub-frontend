import {
  formatDate,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../../../src/client/utils/date-utils'
import { companyExportWinFaker } from '../../../fakers/company-export-win'
import { companyFaker } from '../../../fakers/companies'
import urls from '../../../../../../src/lib/urls'

const company = companyFaker()

const exportWin1 = companyExportWinFaker()
const exportWin2 = companyExportWinFaker()
const exportWin3 = companyExportWinFaker()

const exportWinList = [exportWin1, exportWin2, exportWin3]

const getExpectedMetadata = (win) => ({
  'Lead officer name': win.lead_officer.name,
  'Company name': 'Not set',
  'Contact name': `${win.contact.name} (${win.contact.job_title} - ${win.contact.email})`,
  Destination: win.country,
  'Date won': formatDate(win.date, DATE_FORMAT_MONTH_YEAR),
  'Type of win': win.business_type,
  'Total value': `£${win.value.export.total}`,
  'Type of goods or services': win.name_of_export,
  Sector: win.sector,
})

const exportWinEndpoint = `/api-proxy/v4/company/${company.id}/export-win`
const queryParams = 'confirmed=true&sortby=-created_on&limit=10&offset=0'

describe('Company export wins', () => {
  beforeEach(() => {
    cy.intercept('GET', `${exportWinEndpoint}?${queryParams}`, {
      count: exportWinList.length,
      next: null,
      previous: null,
      results: exportWinList,
    }).as('exportWinResults')
    cy.visit(urls.companies.exports.index(company.id))
    cy.wait('@exportWinResults')
  })

  it('should render a h2 title', () => {
    cy.get('h2').should('have.text', '3 Confirmed export wins')
  })

  it('should display a list of export wins', () => {
    cy.get('[data-test="collection-item"]').should(
      'have.length',
      exportWinList.length
    )
  })

  it('should render all title links and metadata items', () => {
    const expectedMetadata = [
      getExpectedMetadata(exportWin1),
      getExpectedMetadata(exportWin2),
      getExpectedMetadata(exportWin3),
    ]

    cy.get('[data-test="collection-item"]').each((item, index) => {
      cy.wrap(item).within(() => {
        // Assert the title link text
        cy.get('h3')
          .should('exist')
          .invoke('text')
          .then((text) => {
            expect(text).to.eq(
              `${exportWinList[index].name_of_export} to ${exportWinList[index]?.country}`
            )
          })

        // Loop through each metadata item and assert label and value
        cy.get('[data-test="metadata-item"]').each((metaItem) => {
          cy.wrap(metaItem).within(() => {
            cy.get('span')
              .first()
              .invoke('text')
              .then((label) => {
                const expectedValue = expectedMetadata[index][label.trim()]
                cy.get('span').last().should('have.text', expectedValue)
              })
          })
        })
      })
    })
  })
})
