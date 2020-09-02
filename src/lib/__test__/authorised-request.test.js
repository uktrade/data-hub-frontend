const proxyquire = require('proxyquire').noPreserveCache()

let NODE_TLS_REJECT_UNAUTHORIZED

describe('In dev', () => {
  before(() => {
    ;({ NODE_TLS_REJECT_UNAUTHORIZED } = process.env)
  })

  afterEach(() => {
    if (NODE_TLS_REJECT_UNAUTHORIZED) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = NODE_TLS_REJECT_UNAUTHORIZED
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
    }
  })

  describe('With a proxy', () => {
    it('should set an env variable to allow untrusted certificates', () => {
      proxyquire('../authorised-request', {
        '../config': {
          isDev: true,
          proxy: 'http://localhost',
        },
      })
      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).to.equal('0')
    })
  })

  describe('Without a proxy', () => {
    it('Should not allow untrusted certificates', () => {
      proxyquire('../authorised-request', {
        '../config': {
          isDev: true,
        },
      })
      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).to.be.undefined
    })
  })
})

describe('With Zipkin headers', () => {
  it('Should forward Zipkin headers', () => {
    const options = {
      url: 'http://example.com',
    }
    const request = {
      session: {
        token: 'fake-token',
      },
      headers: {
        'x-b3-traceid': 'fake-trace-id',
        'x-b3-spanid': 'fake-span-id',
      },
    }

    const requestPromiseStub = sinon.stub().resolves({})
    const { authorisedRequest } = proxyquire('../authorised-request', {
      'request-promise': requestPromiseStub,
    })

    authorisedRequest(request, options)

    expect(requestPromiseStub.firstCall.lastArg.headers).deep.equals({
      Authorization: 'Bearer fake-token',
      'x-b3-spanid': 'fake-span-id',
      'x-b3-traceid': 'fake-trace-id',
    })
  })
})
