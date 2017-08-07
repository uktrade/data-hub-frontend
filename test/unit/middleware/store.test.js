describe('Store middleware', () => {
  beforeEach(() => {
    this.storeMiddleware = require('~/src/middleware/store')()
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.reqMock = {
      session: {},
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('store middleware sets up correctly', () => {
    it('req should have expected store methods', () => {
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      expect(this.reqMock.store).to.be.a('function')
      expect(this.reqMock.store.get).to.be.a('function')
      expect(this.reqMock.store.remove).to.be.a('function')
      expect(this.reqMock.session.store).to.be.a('object')
    })

    it('call the next middleware', () => {
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      expect(this.nextSpy.calledOnce).to.be.true
    })
  })

  describe('when store middleware is set up', () => {
    it('data should be stored in session.store correctly', () => {
      const mockDataArray = ['data']
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockDataArray)

      expect(this.nextSpy.calledOnce).to.be.true
      expect(this.reqMock.session.store).to.deep.equal({ 'example_key': mockDataArray })
    })

    it('#get should get stored data', () => {
      const mockData = 'data'
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockData)
      const storeData = this.reqMock.store.get('example_key')

      expect(this.nextSpy.calledOnce).to.be.true
      expect(this.reqMock.session.store).to.deep.equal({ 'example_key': mockData })
      expect(storeData).to.equal(mockData)
    })

    it('#remove should get stored data', () => {
      const mockDataObj = { value: 'data' }
      this.storeMiddleware(this.reqMock, {}, this.nextSpy)

      this.reqMock.store('example_key', mockDataObj)

      expect(this.nextSpy.calledOnce).to.be.true
      expect(this.reqMock.session.store).to.deep.equal({ 'example_key': mockDataObj })

      this.reqMock.store.remove('example_key')
      expect(this.reqMock.session.store).to.deep.equal({})
    })
  })
})
