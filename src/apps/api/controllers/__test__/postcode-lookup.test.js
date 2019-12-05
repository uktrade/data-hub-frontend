const proxyquire = require('proxyquire')

describe('postcodeLookupHandler', () => {
  beforeEach(() => {
    this.req = { params: { postcode: 'dn21 6fg' } }
    this.resMock = {
      send: sinon.spy(),
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    }
    this.lookupAddressStub = sinon.stub().resolves([
      { country: 'united kingdom' },
    ])
    this.controller = proxyquire('../postcode-lookup', {
      '../services': {
        lookupAddress: postcode => this.lookupAddressStub(postcode),
      },
      '../../../lib/metadata': {
        countryOptions: [{
          id: '1234',
          name: 'United Kingdom',
        }],
      },
    })
  })

  context('when the external api service returns successful response', () => {
    beforeEach(async () => {
      await this.controller.postcodeLookupHandler(this.req, this.resMock)
    })
    it('should return postcode response', () => {
      expect(this.resMock.json).to.be.calledWith([{ country: '1234' }])
    })
  })

  context('when the external api service returns an error', () => {
    beforeEach(async () => {
      this.statusCode = 400
      this.message = 'error'
      this.lookupAddressStub = sinon.stub().throws({
        statusCode: this.statusCode, message: this.message,
      })
      await this.controller.postcodeLookupHandler(this.req, this.resMock)
    })
    it('should return correct status code and message on error', () => {
      expect(this.resMock.status).to.be.calledWith(this.statusCode)
      expect(this.resMock.json).to.be.calledWith({ message: this.message })
    })
  })
})
