const config = require('~/config')

describe('feature flag middleware', () => {
  beforeEach(() => {
    this.reqMock = {
      session: {
        token: '1234',
      },
    }

    this.resMock = {
      locals: {},
    }

    this.nextSpy = sandbox.spy()

    this.loggerStub = sandbox.stub()

    this.features = proxyquire('~/src/middleware/features', {
      '../../config/logger': {
        error: this.loggerStub,
      },
    })
  })

  context('When there are feature flags', () => {
    beforeEach(async () => {
      this.featuresData = [{
        code: 'cfe1',
        is_active: true,
      }, {
        code: 'tea1',
        is_active: false,
      }]

      nock(config.apiRoot)
        .get('/v3/feature-flag')
        .reply(200, this.featuresData)

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should get features from the server', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should transform active features into the response', () => {
      expect(this.resMock.locals.features).to.deep.equal({
        cfe1: true,
      })
    })
  })

  context('when there are no feature flags', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v3/feature-flag')
        .reply(200, [])

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should get features from the server', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should contain put an empty set of features in the response', () => {
      expect(this.resMock.locals.features).to.deep.equal({})
    })
  })

  context('when the call to get features fails', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v3/feature-flag')
        .reply(500, 'Error message')

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should get features from the server', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should contain put an empty set of features in the response', () => {
      expect(this.resMock.locals.features).to.deep.equal({})
    })

    it('should log the error', () => {
      expect(this.loggerStub).to.be.calledWith('Unable to fetch feature flags: StatusCodeError: 500 - "Error message"')
    })
  })
})
