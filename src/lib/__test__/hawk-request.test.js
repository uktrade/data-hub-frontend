/**
 * Tests for axios version of hawk request
 */
const rewire = require('rewire')

const config = require('../../config')
const { StatusCodeError } = require('../errors')
const {
  expectThrowsAsync,
} = require('../../../test/unit/helpers/promise-assertions')

const modulePath = '../hawk-request'

const testDataHubCredentials = {
  id: 'test-key-id',
  key: 'test-key',
  algorithm: 'sha256',
}
const testClientHeaderArtifacts = { fake: 'artifacts' }
const testRequestOptions = {
  url: `${config.apiRoot}/v4/metadata/countries`,
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Fake header',
    'Content-Type': 'application/json',
  },
}

describe('#hawkRequest: check getHawkHeader', () => {
  beforeEach(() => {
    this.hawkRequest = rewire(modulePath)
    this.configStub = sinon.stub()
    this.expectedHawkHeader = {
      header:
        'Hawk id="test-key-id", ts="1501545600", nonce="Sj_D4e", hash="B0weSUXsMcb5UhL41FZbrUJCAotzSI3HawE1NPLRUz8=", mac="eUfXrU30nDxsrP0+c6s54EaP8Dyuhp7JfBEFO4Ufllw="',
      artifacts: {
        ts: 1501545600,
        nonce: 'Sj_D4e',
        method: 'GET',
        resource: '/',
        host: 'test-url',
        port: 80,
        hash: 'B0weABCsMcb5UhL41FZbrUJCAotzSI3HawE1NPLRUz8=',
        ext: undefined,
        app: undefined,
        dlg: undefined,
      },
    }
    this.hawkHeaderStub = sinon.stub().returns(this.expectedHawkHeader)
    this.hawkRequest.__set__('config', this.configStub)
    this.hawkRequest.__set__('Hawk.client.header', this.hawkHeaderStub)
  })

  it('gets hawk header', () => {
    const getHawkHeader = this.hawkRequest.__get__('getHawkHeader')

    const requestOptionsStub = sinon.stub()
    requestOptionsStub.url = 'http://test-url'
    requestOptionsStub.method = 'GET'

    const completeHeader = getHawkHeader(
      testDataHubCredentials,
      requestOptionsStub
    )

    expect(this.hawkHeaderStub).to.have.been.calledOnceWith(
      requestOptionsStub.url,
      requestOptionsStub.method,
      {
        credentials: testDataHubCredentials,
        payload: '',
        contentType: 'application/json',
      }
    )
    expect(completeHeader).to.equal(this.expectedHawkHeader)
  })
})

describe('#hawkRequest: check sendHawkRequest', () => {
  beforeEach(() => {
    this.configStub = sinon.stub()
    this.configStub.hawkCredentials = sinon.stub()
    this.configStub.hawkCredentials.dataHubBackend = testDataHubCredentials
    this.hawkRequest = rewire(modulePath)
    this.hawkRequest.__set__('config', this.configStub)
    this.hawkRequestPromiseSpy = sinon.spy()
    this.hawkRequest.__set__('hawkRequestPromise', this.hawkRequestPromiseSpy)

    this.getHawkHeaderStub = sinon.stub().returns({
      artifacts: { fake: 'artifacts' },
      header: 'Fake header',
    })

    this.hawkRequest.__set__('getHawkHeader', this.getHawkHeaderStub)
  })

  it('fails when no url provided', async () => {
    await expectThrowsAsync(() => this.hawkRequest())
  })

  it('calls hawkRequestPromise', async () => {
    await this.hawkRequest(config.apiRoot + '/v4/metadata/countries')
    expect(this.hawkRequestPromiseSpy).to.have.been.calledOnceWith(
      testRequestOptions,
      testDataHubCredentials,
      {
        fake: 'artifacts',
      }
    )
  })
})

describe('#hawkRequest: check hawkRequestPromise', () => {
  beforeEach(() => {
    this.configStub = sinon.stub()
    this.hawkRequest = rewire(modulePath)
    this.hawkRequest.__set__('config', this.configStub)
    this.hawkRequest.__set__(
      'Hawk.client.authenticate',
      sinon.stub().returns(true)
    )
  })

  it('gets correct response', async () => {
    this.hawkRequest.__set__('request', () =>
      Promise.resolve({ status: 200, data: { fake: 'reply' } })
    )
    this.hawkRequestPromise = this.hawkRequest.__get__('hawkRequestPromise')

    await this.hawkRequestPromise(
      testRequestOptions,
      testDataHubCredentials,
      testClientHeaderArtifacts
    ).then((response) => {
      expect(response).to.deep.equal({ fake: 'reply' })
    })
  })

  it('fails when response status code is not 200', async () => {
    this.hawkRequest.__set__('request', () =>
      Promise.reject(StatusCodeError('Server Error', 500))
    )
    this.hawkRequestPromise = this.hawkRequest.__get__('hawkRequestPromise')

    await expectThrowsAsync(() =>
      this.hawkRequestPromise(
        testRequestOptions,
        testDataHubCredentials,
        testClientHeaderArtifacts
      )
    )
  })

  it('fails when response is not valid', async () => {
    this.hawkRequest.__set__('request', () =>
      Promise.resolve({ status: 401, data: {} })
    )
    this.hawkRequestPromise = this.hawkRequest.__get__('hawkRequestPromise')

    const authenticateStub = sinon.stub().returns(true)
    this.hawkRequest.__set__('Hawk.client.authenticate', authenticateStub)

    await expectThrowsAsync(() =>
      this.hawkRequestPromise(
        testRequestOptions,
        testDataHubCredentials,
        testClientHeaderArtifacts
      )
    )

    expect(authenticateStub).to.be.calledOnceWith(
      { status: 401, data: {} },
      testDataHubCredentials,
      testClientHeaderArtifacts,
      '{}'
    )
  })

  it('fails when authenticate throws', async () => {
    this.hawkRequest.__set__('request', () => Promise.resolve({ status: 200 }))
    this.hawkRequestPromise = this.hawkRequest.__get__('hawkRequestPromise')

    const authenticateStub = sinon.stub().throws(Error)
    this.hawkRequest.__set__('Hawk.client.authenticate', authenticateStub)

    await expectThrowsAsync(() =>
      this.hawkRequestPromise(
        testRequestOptions,
        testDataHubCredentials,
        testClientHeaderArtifacts
      )
    )

    expect(authenticateStub).to.be.calledOnceWith(
      { status: 200 },
      testDataHubCredentials,
      testClientHeaderArtifacts,
      '{}'
    )
  })
})
