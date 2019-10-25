const proxyquire = require('proxyquire').noPreserveCache()

let PROXY
let NODE_TLS_REJECT_UNAUTHORIZED

describe('In dev', () => {
  before(() => {
    ({ PROXY, NODE_TLS_REJECT_UNAUTHORIZED } = process.env)
  })

  afterEach(() => {
    if (PROXY) {
      process.env.PROXY = PROXY
    } else {
      delete process.env.PROXY
    }

    if (NODE_TLS_REJECT_UNAUTHORIZED) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = NODE_TLS_REJECT_UNAUTHORIZED
    } else {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
    }
  })

  describe('With a proxy', () => {
    it('should set an env variable to allow untrusted certificates', () => {
      process.env.PROXY = '1'
      proxyquire('../authorised-request', {
        '../../config': {
          isDev: true,
        },
      })
      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).to.equal('0')
    })
  })

  describe('Without a proxy', () => {
    it('Should not allow untrusted certificates', () => {
      proxyquire('../authorised-request', {
        '../../config': {
          isDev: true,
        },
      })
      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).to.be.undefined
    })
  })
})
