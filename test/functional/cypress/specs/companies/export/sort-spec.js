import companyExportWinListFaker from '../../../fakers/company-export-win'
import { companyFaker } from '../../../fakers/companies'
import urls from '../../../../../../src/lib/urls'

const company = companyFaker()

const transformOptions = (options) =>
  [...options].map(({ value, label }) => ({
    value,
    label,
  }))

const getQueryParamsFromUrl = (url) => new URLSearchParams(url.split('?')[1])

const exportWinsEndpoint = `/api-proxy/v4/company/${company.id}/export-win`
const newest = `${exportWinsEndpoint}?confirmed=true&sortby=-created_on&limit=10&offset=0`
const oldest = `${exportWinsEndpoint}?confirmed=true&sortby=created_on&limit=10&offset=0`

describe('Export pipeline sort', () => {
  const exportWins = companyExportWinListFaker(3)

  beforeEach(() => {
    cy.visit(urls.companies.exports.index(company.id))
  })

  it('should have all sort options', () => {
    cy.get('[data-test="sortby"] option').then((options) => {
      expect(transformOptions(options)).to.deep.eq([
        { value: '-created_on', label: 'Newest' },
        { value: 'created_on', label: 'Oldest' },
      ])
    })
  })

  it('should sort by "Oldest" export win', () => {
    cy.intercept('GET', oldest, {
      body: {
        count: exportWins.length,
        results: exportWins,
      },
    }).as('oldest')
    cy.get('[data-test="sortby"] select').select('Oldest')
    cy.wait('@oldest').then(({ request }) => {
      const urlParams = getQueryParamsFromUrl(request.url)
      expect(urlParams.get('sortby')).to.eq('created_on')
    })
  })

  it('should sort by "Newest" export win', () => {
    cy.intercept('GET', newest, {
      body: {
        count: exportWins.length,
        results: exportWins,
      },
    }).as('newest')
    cy.get('[data-test="sortby"] select').select('Newest')
    cy.wait('@newest').then(({ request }) => {
      const urlParams = getQueryParamsFromUrl(request.url)
      expect(urlParams.get('sortby')).to.eq('-created_on')
    })
  })
})
