const ch = require('../../data/companies-house.json')

describe('Companies house repos', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.authSub = this.sandbox.stub().resolves(ch)

    this.repos = proxyquire('~/src/apps/companies-house/repos', {
      '../../../config': {
        apiRoot: 'http://test.com',
      },
      '../../lib/authorised-request': this.authSub,
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should call the API with the correct url', () => {
    return this.repos.getCompaniesHouse('1234', '4321')
      .then(() => {
        expect(this.authSub).to.be.calledWith('1234', 'http://test.com/v3/ch-company/4321')
      })
  })
})
