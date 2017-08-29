describe('Global transformers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.buildPaginationSpy = this.sandbox.spy()

    this.transformers = proxyquire('~/src/apps/transformers', {
      '../lib/pagination': {
        buildPagination: this.buildPaginationSpy,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#transformObjectToOption', () => {
    it('should return value and label from id and name', () => {
      const actual = this.transformers.transformObjectToOption({
        id: '1',
        name: 'One',
        foo: 'bar',
      })

      expect(actual).to.deep.equal({
        value: '1',
        label: 'One',
      })
    })
  })

  describe('#transformStringToOption', () => {
    it('should return value and label from string', () => {
      const actual = this.transformers.transformStringToOption('One')

      expect(actual).to.deep.equal({
        value: 'One',
        label: 'One',
      })
    })
  })

  describe('#transformContactToOption', () => {
    it('should return value and label from id and first_name/last_name', () => {
      const actual = this.transformers.transformContactToOption({
        id: '1',
        first_name: 'Steve',
        last_name: 'George',
        foo: 'bar',
      })

      expect(actual).to.deep.equal({
        value: '1',
        label: 'Steve George',
      })
    })
  })

  describe('#transformIdToObject', () => {
    it('should return an object with id', () => {
      const actual = this.transformers.transformIdToObject('123456')

      expect(actual).to.deep.equal({
        id: '123456',
      })
    })
  })

  describe('#transformApiResponseToCollection', () => {
    beforeEach(() => {
      this.mockResponse = {
        count: 2,
        results: [
          { a: 'A' },
          { b: 'B' },
        ],
      }
    })

    it('should return a function when high-order function is called without arguments', () => {
      expect(this.transformers.transformApiResponseToCollection()).to.be.a('function')
    })

    it('should return undefined when returned function is called with invalid arguments', () => {
      expect(this.transformers.transformApiResponseToCollection()()).to.be.undefined
      expect(this.transformers.transformApiResponseToCollection()('abc')).to.be.undefined
      expect(this.transformers.transformApiResponseToCollection()([], 'a')).to.be.undefined
      expect(this.transformers.transformApiResponseToCollection()(null)).to.be.undefined
      expect(this.transformers.transformApiResponseToCollection()({})).to.be.undefined
    })

    it('should return undefined if items property is not in response', () => {
      expect(this.transformers.transformApiResponseToCollection()({ a: 'A' })).to.be.undefined
    })

    it('should return a collection object with pagination result, count and items array', () => {
      const actual = this.transformers.transformApiResponseToCollection({ entityType: 'company' })(this.mockResponse)

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('items').to.be.an('array').and.have.length(2)
      expect(actual).to.have.property('pagination')
      expect(this.buildPaginationSpy).to.be.called
    })

    it('should return a collection object with items transformed by given transformer with arguments', () => {
      const itemTransformerInnerSpy = this.sandbox.spy()
      const itemTransformerSpy = this.sandbox.stub().returns(itemTransformerInnerSpy)
      const itemTransformerOptions = { query: { term: 'bobby' } }

      const actual = this.transformers.transformApiResponseToCollection(
        { entityType: 'company' },
        itemTransformerSpy(itemTransformerOptions)
      )(this.mockResponse)

      expect(itemTransformerInnerSpy).to.be.calledTwice
      expect(itemTransformerSpy).to.be.calledWith(itemTransformerOptions)
      expect(actual).to.have.property('items').to.have.length(2)
    })

    it('should return a collection object with items transformed by multiple transformers', () => {
      const firstItemTransformerSpy = this.sandbox.spy()
      const secondItemTransformerSpy = this.sandbox.spy()

      const actual = this.transformers.transformApiResponseToCollection(
        {
          entityType: 'company',
        },
        firstItemTransformerSpy,
        secondItemTransformerSpy
      )(this.mockResponse)

      expect(firstItemTransformerSpy).to.be.calledTwice
      expect(secondItemTransformerSpy).to.be.calledTwice
      expect(actual).to.have.property('items').to.have.length(2)
    })
  })
})
