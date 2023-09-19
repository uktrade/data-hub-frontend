const config = require('../../../config')

const { getInvestment } = require('../../../apps/investments/repos')

const investmentData = require('../../../../test/unit/data/investment/investment-data.json')

const stubRequest = { session: { token: 'token' } }

describe('Investment repository', () => {
  describe('#getInvestment', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/investment/${investmentData.id}`)
        .reply(200, investmentData)
      this.investmentProject = await getInvestment(
        stubRequest,
        investmentData.id
      )
    })

    it('should return an investment object', () => {
      expect(this.investmentProject).to.deep.equal(investmentData)
    })
  })
})
