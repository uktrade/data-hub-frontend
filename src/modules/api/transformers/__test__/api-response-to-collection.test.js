const proxyquire = require('proxyquire')

describe('#transformApiResponseToCollection', () => {
  beforeEach(() => {
    this.buildPaginationSpy = sinon.spy()
    this.transformApiResponseToCollection = proxyquire(
      '../api-response-to-collection',
      {
        '../../../lib/pagination': {
          buildPagination: this.buildPaginationSpy,
        },
      }
    )
    this.mockResponse = {
      count: 2,
      results: [{ a: 'A' }, { b: 'B' }],
    }
  })

  it('should return a function when high-order function is called without arguments', () => {
    expect(this.transformApiResponseToCollection()).to.be.a('function')
  })

  it('should return undefined when returned function is called with invalid arguments', () => {
    expect(this.transformApiResponseToCollection()()).to.be.undefined
    expect(this.transformApiResponseToCollection()('abc')).to.be.undefined
    expect(this.transformApiResponseToCollection()([], 'a')).to.be.undefined
    expect(this.transformApiResponseToCollection()(null)).to.be.undefined
    expect(this.transformApiResponseToCollection()({})).to.be.undefined
  })

  it('should return undefined if items property is not in response', () => {
    expect(this.transformApiResponseToCollection()({ a: 'A' })).to.be.undefined
  })

  it('should return a collection object with pagination result, count and items array', () => {
    const actual = this.transformApiResponseToCollection()(this.mockResponse)

    expect(actual).to.have.property('count', 2)
    expect(actual)
      .to.have.property('items')
      .to.be.an('array')
      .and.have.length(2)
    expect(actual).to.have.property('pagination')
    expect(this.buildPaginationSpy).to.be.called
  })

  context('when an item transformer is specified with arguments', () => {
    beforeEach(() => {
      this.itemTransformerInnerSpy = sinon.spy()
      this.itemTransformerSpy = sinon
        .stub()
        .returns(this.itemTransformerInnerSpy)
      this.itemTransformerOptions = { query: { term: 'bobby' } }

      this.transformApiResponseToCollection(
        undefined,
        this.itemTransformerSpy(this.itemTransformerOptions)
      )(this.mockResponse)
    })

    it('call the item transformer with the arguments', () => {
      expect(this.itemTransformerSpy).to.be.calledWith(
        this.itemTransformerOptions
      )
    })
  })

  context('when there are multiple item transformers', () => {
    beforeEach(() => {
      this.firstItemTransformerStub = sinon
        .stub()
        .onCall(0)
        .returns({ id: '0' })
        .onCall(1)
        .returns({ id: '1' })

      this.secondItemTransformerStub = sinon
        .stub()
        .onCall(0)
        .returns({ id: 'a0' })
        .onCall(1)
        .returns({ id: 'a1' })

      this.result = this.transformApiResponseToCollection(
        undefined,
        this.firstItemTransformerStub,
        this.secondItemTransformerStub
      )(this.mockResponse)
    })

    it('should call the first transformer for each item', () => {
      expect(this.firstItemTransformerStub).to.be.calledTwice
      expect(this.secondItemTransformerStub).to.be.calledTwice
    })

    it('should call the second transformer for each item', () => {
      expect(this.secondItemTransformerStub).to.be.calledTwice
    })

    it('should pass all the items through', () => {
      expect(this.result).to.have.property('items').to.have.length(2)
    })
  })

  context('when the item transformer fails for an item', () => {
    beforeEach(() => {
      const itemTransformerStub = sinon
        .stub()
        .onCall(0)
        .returns(undefined)
        .onCall(1)
        .returns({ id: '1' })

      this.result = this.transformApiResponseToCollection(
        undefined,
        itemTransformerStub
      )(this.mockResponse)
    })

    it('should filter out undefined items', () => {
      expect(this.result.items).to.deep.equal([{ id: '1' }])
    })
  })
})
