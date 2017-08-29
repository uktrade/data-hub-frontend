describe('Search transformers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.transformApiResponseToCollectionInnerStub = this.sandbox.stub().returns()
    this.transformApiResponseToCollectionStub = this.sandbox.stub().returns(this.transformApiResponseToCollectionInnerStub)
    this.buildSearchAggregationStub = this.sandbox.stub()

    this.responseMock = {
      aggregations: {},
      items: [],
    }

    this.transformers = proxyquire('~/src/apps/search/transformers', {
      '../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionStub,
      },
      './builders': {
        buildSearchAggregation: this.buildSearchAggregationStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#transformApiResponseToSearchCollection', () => {
    it('should return a function when high-order function is called without arguments', () => {
      expect(this.transformers.transformApiResponseToSearchCollection()).to.be.a('function')
    })

    it('should return undefined when returned function is called with invalid arguments', () => {
      expect(this.transformers.transformApiResponseToSearchCollection()()).to.be.undefined
    })

    it('should return collection with response transformed into a collection object', () => {
      const actual = this.transformers.transformApiResponseToSearchCollection()(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(this.responseMock)
      expect(actual).to.have.property('highlightTerm', undefined)
      expect(actual).to.have.property('aggregations', undefined)
    })

    it('should call transformApiResponseToCollection transformer returning augmented collection object', () => {
      const actual = this.transformers.transformApiResponseToSearchCollection()(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(this.responseMock)
      expect(actual).to.have.property('highlightTerm', undefined)
      expect(actual).to.have.property('aggregations', undefined)
    })

    it('should call transformApiResponseToCollection transformer with entity type and options', () => {
      const options = {
        entityType: 'contact',
        query: { a: 'A' },
      }
      this.transformers.transformApiResponseToSearchCollection(options)(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(this.responseMock)
      expect(this.transformApiResponseToCollectionStub).to.be.calledWith(options)
    })

    it('should call transformApiResponseToCollection transformer with given transformers', () => {
      const firstItemTransformerSpy = this.sandbox.spy()
      const secondItemTransformerSpy = this.sandbox.spy()

      const options = { entityType: 'contact' }

      this.transformers.transformApiResponseToSearchCollection(
        options,
        firstItemTransformerSpy,
        secondItemTransformerSpy
      )(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(this.responseMock)
      expect(this.transformApiResponseToCollectionStub).to.be.calledWith(options, firstItemTransformerSpy, secondItemTransformerSpy)
    })

    it('should return a collection object with aggregation', () => {
      const aggregationsMock = [{ count: 5, entity: 'contact' }]
      const itemsMock = [{ a: 'A', b: 'B' }]
      this.buildSearchAggregationStub.returns(aggregationsMock)
      this.transformApiResponseToCollectionInnerStub.returns({ count: 2, items: itemsMock })
      const actual = this.transformers.transformApiResponseToSearchCollection()(this.responseMock)

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('aggregations', aggregationsMock)
      expect(actual).to.have.property('items', itemsMock)
    })

    it('should return a collection object with highlight term', () => {
      const options = {
        entityType: 'contact',
        searchTerm: 'loop',
      }
      const itemsMock = [{ a: 'A', b: 'B' }]
      this.transformApiResponseToCollectionInnerStub.returns({ count: 2, items: itemsMock })
      const actual = this.transformers.transformApiResponseToSearchCollection(options)(this.responseMock)

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('highlightTerm', options.searchTerm)
      expect(actual).to.have.property('items', itemsMock)
    })
  })
})
