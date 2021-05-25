const proxyquire = require('proxyquire')

describe('Search transformers', () => {
  beforeEach(() => {
    this.transformApiResponseToCollectionInnerStub = sinon.stub().returns()
    this.transformApiResponseToCollectionStub = sinon
      .stub()
      .returns(this.transformApiResponseToCollectionInnerStub)
    this.buildSearchAggregationStub = sinon.stub()

    this.responseMock = {
      aggregations: {},
      entityDetails: [],
    }

    this.transformApiResponseToSearchCollection = proxyquire(
      '../api-response-to-search-collection',
      {
        '../../api/transformers': {
          transformApiResponseToCollection:
            this.transformApiResponseToCollectionStub,
        },
        '../builders': {
          buildSearchAggregation: this.buildSearchAggregationStub,
        },
      }
    )
  })

  describe('#transformApiResponseToSearchCollection', () => {
    it('should return a function when high-order function is called without arguments', () => {
      expect(this.transformApiResponseToSearchCollection()).to.be.a('function')
    })

    it('should return undefined when returned function is called with invalid arguments', () => {
      expect(this.transformApiResponseToSearchCollection()()).to.be.undefined
    })

    it('should return collection with response transformed into a collection object', () => {
      const actual = this.transformApiResponseToSearchCollection()(
        this.responseMock
      )

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(
        this.responseMock
      )
      expect(actual).to.have.property('highlightTerm', undefined)
      expect(actual).to.have.property('aggregations', undefined)
    })

    it('should call transformApiResponseToCollection transformer returning augmented collection object', () => {
      const actual = this.transformApiResponseToSearchCollection()(
        this.responseMock
      )

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(
        this.responseMock
      )
      expect(actual).to.have.property('highlightTerm', undefined)
      expect(actual).to.have.property('aggregations', undefined)
    })

    it('should call transformApiResponseToCollection transformer with entity type and options', () => {
      const options = {
        query: { a: 'A' },
      }
      this.transformApiResponseToSearchCollection(options)(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(
        this.responseMock
      )
      expect(this.transformApiResponseToCollectionStub).to.be.calledWith(
        options
      )
    })

    it('should call transformApiResponseToCollection transformer with given transformers', () => {
      const firstItemTransformerSpy = sinon.spy()
      const secondItemTransformerSpy = sinon.spy()

      this.transformApiResponseToSearchCollection(
        undefined,
        [],
        firstItemTransformerSpy,
        secondItemTransformerSpy
      )(this.responseMock)

      expect(this.transformApiResponseToCollectionInnerStub).to.be.calledWith(
        this.responseMock
      )
      expect(this.transformApiResponseToCollectionStub).to.be.calledWith(
        {},
        firstItemTransformerSpy,
        secondItemTransformerSpy
      )
    })

    it('should return a collection object with aggregation', () => {
      const aggregationsMock = [{ count: 5, entity: 'contact' }]
      const itemsMock = [{ a: 'A', b: 'B' }]
      this.buildSearchAggregationStub.returns(aggregationsMock)
      this.transformApiResponseToCollectionInnerStub.returns({
        count: 2,
        items: itemsMock,
      })
      const actual = this.transformApiResponseToSearchCollection()(
        this.responseMock
      )

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('aggregations', aggregationsMock)
      expect(actual).to.have.property('items', itemsMock)
    })

    it('should return a collection object with highlight term', () => {
      const options = { searchTerm: 'loop' }
      const itemsMock = [{ a: 'A', b: 'B' }]
      this.transformApiResponseToCollectionInnerStub.returns({
        count: 2,
        items: itemsMock,
      })
      const actual = this.transformApiResponseToSearchCollection(options)(
        this.responseMock
      )

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('highlightTerm', options.searchTerm)
      expect(actual).to.have.property('items', itemsMock)
    })
  })
})
