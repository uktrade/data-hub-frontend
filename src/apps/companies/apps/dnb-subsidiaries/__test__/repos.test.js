const config = require('../../../../../config')
const { getDnbSubsidiaries } = require('../repos')
const { mockDnbSubsidiariesEndpoint } = require('./utils')
const subsidiaries = require('../../../../../../test/unit/data/companies/subsidiary-company-search-response')

const token = 'abcd'

describe('D&B Subsidiaries repos', () => {
  describe('#getDnbSubsidiaries', () => {
    let actual
    const DUNS_NUMBER = 999999

    beforeEach(async () => {
      mockDnbSubsidiariesEndpoint({
        globalUltimateSunsNumber: DUNS_NUMBER,
        responseBody: subsidiaries,
      })

      actual = await getDnbSubsidiaries(token, DUNS_NUMBER, config.paginationDefaultSize, 1)
    })

    it('should return the one subsidiary', () => {
      expect(actual).to.deep.equal({
        count: 1,
        results: [subsidiaries.results[1]],
      })
    })
  })
})
