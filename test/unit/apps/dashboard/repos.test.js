const config = require('../../../../config')

function makeRepositoryWithAuthRequest (authorisedRequestStub) {
  return proxyquire('~/src/apps/dashboard/repos.js', {
    '../../lib/authorised-request': { authorisedRequest: authorisedRequestStub },
  })
}

describe('Dashboard', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub()
    this.repo = makeRepositoryWithAuthRequest(this.authorisedRequestStub)
  })
  describe('#fetchHomepageData', () => {
    it('should call the Zen desk API', async () => {
      await this.repo.fetchHomepageData('TEST_TOKEN')
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', `${config.apiRoot}/dashboard/homepage/`)
    })
  })

  describe('#fetchCompanyList', () => {
    it('should call the Zen desk API', async () => {
      await this.repo.fetchCompanyList('TEST_TOKEN')
      expect(this.authorisedRequestStub).calledOnceWithExactly('TEST_TOKEN', {
        method: 'GET',
        url: `${config.apiRoot}/v4/user/company-list`,
      })
    })
  })
})
