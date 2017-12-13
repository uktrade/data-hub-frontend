describe('api controllers', () => {
  beforeEach(() => {
    this.req = { params: { postcode: 'dn21 6fg' } }
    this.resMock = {
      send: sandbox.spy(),
      json: sandbox.spy(),
      status: sandbox.stub().returnsThis(),
    }
    this.lookupAddressStub = sandbox.stub().resolves([
      { country: 'united kingdom' },
    ])
    this.controller = proxyquire('~/src/apps/api/controllers', {
      './services': {
        lookupAddress: postcode => this.lookupAddressStub(postcode),
      },
      '../../lib/metadata': {
        countryOptions: [{
          id: '1234',
          name: 'United Kingdom',
        }],
      },
    })
  })

  describe('postcodeLookupHandler', () => {
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
        this.lookupAddressStub = sandbox.stub().throws({
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
})
