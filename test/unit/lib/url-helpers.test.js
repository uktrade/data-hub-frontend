const urlHelpers = require('~/src/lib/url-helpers')

describe('buildQueryString', function () {
  it('should build the expected query string for a single param', function () {
    const params = {
      mock: 'mockParam',
    }
    const queryString = urlHelpers.buildQueryString(params)

    expect(queryString).equal(`?mock=${params.mock}`)
  })

  it('should build the expected query string for multiple params', function () {
    const params = {
      mock: 'mockParam',
      mock1: 'mockParam1',
      mock2: 'mockParam2',
    }
    const queryString = urlHelpers.buildQueryString(params)

    expect(queryString).equal(`?mock=${params.mock}&mock1=${params.mock1}&mock2=${params.mock2}`)
  })
})
