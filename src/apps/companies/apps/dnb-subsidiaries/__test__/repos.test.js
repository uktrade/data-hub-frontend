const config = require('../../../../../config')
const { getDnbSubsidiaries } = require('../repos')
const { mockDnbSubsidiariesEndpoint } = require('./utils')
const subsidiaries = require('../../../../../../test/unit/data/companies/subsidiary-company-search-response')

const TOKEN = 'abcd'
const DUNS_NUMBER = 999999

describe('D&B Subsidiaries repos', () => {
  describe('#getDnbSubsidiaries', () => {
    let actual

    before(async () => {
      mockDnbSubsidiariesEndpoint({
        globalUltimateSunsNumber: DUNS_NUMBER,
        responseBody: subsidiaries,
      })

      actual = await getDnbSubsidiaries(TOKEN, DUNS_NUMBER, config.paginationDefaultSize, 1)
    })

    it('should return the one subsidiary', () => {
      expect(actual).to.deep.equal(subsidiaries)
    })
  })
})
