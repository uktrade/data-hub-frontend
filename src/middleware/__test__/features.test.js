const proxyquire = require('proxyquire')

const config = require('../../config')

// TODO: check with team whether we are keeping this functionality; write functional test for feature flag
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

    this.nextSpy = sinon.spy()

    this.loggerStub = sinon.stub()

    this.features = proxyquire('../features', {
      '../config/logger': {
        error: this.loggerStub,
      },
    })

    this.featuresData = [
      {
        code: 'cfe1',
        is_active: true,
      },
      {
        code: 'tea1',
        is_active: false,
      },
    ]
  })

  context('when the user is not logged in', () => {
    beforeEach(async () => {
      delete this.reqMock.session.token

      nock(config.apiRoot).get('/v3/feature-flag').reply(200, this.featuresData)

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should not call the backend to get features', () => {
      expect(nock.isDone()).to.be.false
    })

    it('should not report an error', () => {
      expect(this.loggerStub).to.not.be.called
    })
  })

  context('when a call is made to the support page', () => {
    beforeEach(async () => {
      this.reqMock.url = '/support'

      nock(config.apiRoot).get('/v3/feature-flag').reply(200, this.featuresData)

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should not call the backend to get features', () => {
      expect(nock.isDone()).to.be.false
    })

    it('should not report an error', () => {
      expect(this.loggerStub).to.not.be.called
    })
  })

  context('when a call is made to the healthcheck page', () => {
    beforeEach(async () => {
      this.reqMock.url = '/healthcheck'

      nock(config.apiRoot).get('/v3/feature-flag').reply(200, this.featuresData)

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should not call the backend to get features', () => {
      expect(nock.isDone()).to.be.false
    })

    it('should not report an error', () => {
      expect(this.loggerStub).to.not.be.called
    })
  })

  context('when a call is made to the oauth page', () => {
    beforeEach(async () => {
      this.reqMock.url = '/oauth'

      nock(config.apiRoot).get('/v3/feature-flag').reply(200, this.featuresData)

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should not call the backend to get features', () => {
      expect(nock.isDone()).to.be.false
    })

    it('should not report an error', () => {
      expect(this.loggerStub).to.not.be.called
    })
  })

  context('when there are feature flags', () => {
    beforeEach(async () => {
      nock(config.apiRoot).get('/v3/feature-flag').reply(200, this.featuresData)

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
      nock(config.apiRoot).get('/v3/feature-flag').reply(200, [])

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
      nock(config.apiRoot).get('/v3/feature-flag').reply(500, 'Error message')

      await this.features(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should get features from the server', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should contain put an empty set of features in the response', () => {
      expect(this.resMock.locals.features).to.deep.equal({})
    })

    it('should log the error', () => {
      expect(this.loggerStub).to.be.calledWith(
        'Unable to fetch feature flags: StatusCodeError: 500 - "Error message"'
      )
    })
  })
})
