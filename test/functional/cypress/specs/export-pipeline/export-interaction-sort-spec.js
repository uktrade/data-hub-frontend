import urls from '../../../../../src/lib/urls'
import { exportFaker } from '../../fakers/export'
import { assertUrl } from '../../support/assertions'

const companyExport = exportFaker()

const companyExportInteractionsEndpoint = '/api-proxy/v4/interaction'
const queryParams = '&limit=10&offset=0'
const requestUrl = `${companyExportInteractionsEndpoint}?company_export_id=${companyExport.id}`

describe('Company Export Interactions Collections Sort', () => {
  context('Default sort', () => {
    beforeEach(() => {
      cy.intercept('POST', `${requestUrl}${queryParams}&sortby=-created_on`).as(
        'apiRequest'
      )
      cy.visit(urls.exportPipeline.interactions.index())
      cy.visit(assertUrl)
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('-created_on')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          name: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: '-created_on', name: 'Recently created' },
          { value: 'company__name', name: 'Company name A-Z' },
          { value: 'subject', name: 'Subject A-Z' },
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept('POST', `${requestUrl}${queryParams}&sortby=-created_on`).as(
        'apiRequest'
      )
      cy.visit(`${urls.exportPipeline.interactions.index()}`)
      cy.wait('@apiRequest')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Recently created')
      assertUrl('sortby=-created_on')
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company name A-Z')
      assertUrl('sortby=company__name')
    })

    it('should sort by "Subject A-Z"', () => {
      cy.get(element).select('Subject A-Z')
      assertUrl('sortby=subject')
    })
  })
})
