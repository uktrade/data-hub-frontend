const config = require('../../../../../config')
const { getDnbHierarchy } = require('../repos')
const { mockGetDnbHierarchy } = require('./utils')

const dnbHierarchyFixture = {
  count: 2,
  results: [{ id: '1' }, { id: '2' }],
}
const stubRequest = { session: { token: 'abcd' } }
const DUNS_NUMBER = 999999

describe('D&B Subsidiaries repos', () => {
  describe('#getDnbHierarchy', () => {
    it('should return the one subsidiary', async () => {
      mockGetDnbHierarchy({
        globalUltimateDunsNumber: DUNS_NUMBER,
        responseBody: dnbHierarchyFixture,
      })

      const actual = await getDnbHierarchy(
        stubRequest,
        DUNS_NUMBER,
        config.paginationDefaultSize,
        1
      )

      expect(actual).to.deep.equal(dnbHierarchyFixture)
    })
  })
})
