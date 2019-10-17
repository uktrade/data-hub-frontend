const config = require('~/config')
const rewire = require('rewire')

const testDataHubCredentials = {
  id: 'test-key-id',
  key: 'test-key',
  algorithm: 'sha256',
}
const testClientHeaderArtifacts = { fake: 'artifacts' }
const testRequestOptions = { uri: 'http://localhost:8000/v4/metadata/countries',
  method: 'GET',
  headers: { accept: 'application/json', Authorization: 'Fake header' },
}

describe('#hawkRequest: check getHawkHeader', () => {
  beforeEach(() => {
    this.hawkRequest = rewire('~/src/lib/hawk-request')
    this.configStub = sinon.stub()
    this.expectedHawkHeader = {
      header: 'Hawk id="test-key-id", ts="1501545600", nonce="Sj_D4e", hash="B0weSUXsMcb5UhL41FZbrUJCAotzSI3HawE1NPLRUz8=", mac="eUfXrU30nDxsrP0+c6s54EaP8Dyuhp7JfBEFO4Ufllw="',
      artifacts: {
        ts: 1501545600,
        nonce: 'Sj_D4e',
        method: 'GET',
        resource: '/',
        host: 'test-uri',
        port: 80,
        hash: 'B0weABCsMcb5UhL41FZbrUJCAotzSI3HawE1NPLRUz8=',
        ext: undefined,
        app: undefined,
        dlg: undefined,
      },
    }
    this.hawkHeaderStub = sinon.stub().returns(this.expectedHawkHeader)
    this.hawkRequest.__set__('config', this.configStub)
    this.hawkRequest.__set__('hawk.client.header', this.hawkHeaderStub)
  })

  it('gets hawk header', () => {
    const getHawkHeader = this.hawkRequest.__get__('getHawkHeader')

    let requestOptionsStub = sinon.stub()
    requestOptionsStub.uri = 'http://test-uri'
    requestOptionsStub.method = 'GET'

    const completeHeader = getHawkHeader(testDataHubCredentials, requestOptionsStub)

    expect(this.hawkHeaderStub).to.have.been.calledOnceWith(
      requestOptionsStub.uri,
      requestOptionsStub.method,
      {
        credentials: testDataHubCredentials,
        payload: '',
        contentType: '',
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
    this.hawkRequest = rewire('~/src/lib/hawk-request')
    this.hawkRequest.__set__('config', this.configStub)
    this.createPromiseRequestSpy = sinon.spy()
    this.hawkRequest.__set__('createPromiseRequest', this.createPromiseRequestSpy)

    this.getHawkHeaderStub = sinon.stub().returns({
      artifacts: { fake: 'artifacts' },
      header: 'Fake header',
    })

    this.hawkRequest.__set__('getHawkHeader', this.getHawkHeaderStub)
  })

  it('fails when no uri provided', async () => {
    await expect(this.hawkRequest()).to.be.rejectedWith(Error)
  })

  it('calls createPromiseRequest', async () => {
    await this.hawkRequest(config.apiRoot + '/v4/metadata/countries')
    expect(this.createPromiseRequestSpy).to.have.been.calledOnceWith(
      testRequestOptions,
      testDataHubCredentials,
      { fake: 'artifacts' },
    )
  })
})

describe('#hawkRequest: check createPromiseRequest', () => {
  beforeEach(() => {
    this.configStub = sinon.stub()
    this.hawkRequest = rewire('~/src/lib/hawk-request')
    this.hawkRequest.__set__('config', this.configStub)
    this.hawkRequest.__set__('hawk.client.authenticate', sinon.stub().returns(true))
  })

  it('gets correct response', async () => {
    this.hawkRequest.__set__('request', (requestOptions, cb) => {
      const response = { statusCode: 200 }
      cb(null, response, '{"fake":"reply"}')
    })
    this.createPromiseRequest = this.hawkRequest.__get__('createPromiseRequest')

    await this.createPromiseRequest(
      testRequestOptions,
      testDataHubCredentials,
      testClientHeaderArtifacts,
    ).then((response) => {
      expect(response).to.deep.equal({ fake: 'reply' })
    })
  })

  it('fails when response status code is not 200', async () => {
    this.hawkRequest.__set__('request', (requestOptions, cb) => {
      const response = { statusCode: 500 }
      cb(null, response, '{}')
    })
    this.createPromiseRequest = this.hawkRequest.__get__('createPromiseRequest')

    await expect(this.createPromiseRequest(
      testRequestOptions,
      testDataHubCredentials,
      testClientHeaderArtifacts,
    )).to.be.rejectedWith(Error)
  })

  it('fails when response is not valid', async () => {
    this.hawkRequest.__set__('request', (requestOptions, cb) => {
      const response = { statusCode: 401 }
      cb(null, response, '{}')
    })
    this.createPromiseRequest = this.hawkRequest.__get__('createPromiseRequest')

    let authenticateStub = sinon.stub().returns(true)
    this.hawkRequest.__set__('hawk.client.authenticate', authenticateStub)

    await expect(this.createPromiseRequest(
      testRequestOptions,
      testDataHubCredentials,
      testClientHeaderArtifacts,
    )).to.be.rejectedWith(Error)

    expect(authenticateStub).to.be.calledOnceWith(
      { statusCode: 401 },
      testDataHubCredentials,
      testClientHeaderArtifacts,
      { payload: '{}' },
    )
  })

  it('fails when authenticate throws', async () => {
    this.hawkRequest.__set__('request', (requestOptions, cb) => {
      const response = { statusCode: 200 }
      cb(null, response, '{}')
    })
    this.createPromiseRequest = this.hawkRequest.__get__('createPromiseRequest')

    let authenticateStub = sinon.stub().throws(Error)
    this.hawkRequest.__set__('hawk.client.authenticate', authenticateStub)

    await expect(this.createPromiseRequest(
      testRequestOptions,
      testDataHubCredentials,
      testClientHeaderArtifacts,
    )).to.be.rejectedWith(Error)

    expect(authenticateStub).to.be.calledOnceWith(
      { statusCode: 200 },
      testDataHubCredentials,
      testClientHeaderArtifacts,
      { payload: '{}' },
    )
  })
})
