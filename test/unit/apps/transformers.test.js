describe('Global transformers', () => {
  beforeEach(() => {
    this.buildPaginationSpy = sinon.spy()

    this.transformers = proxyquire('~/src/apps/transformers', {
      '../lib/pagination': {
        buildPagination: this.buildPaginationSpy,
      },
    })
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

  describe('#transformDateObjectToDateString', () => {
    context('when invalid key', () => {
      it('should throw an error', () => {
        const actual = () => this.transformers.transformDateObjectToDateString()

        expect(actual).to.throw('date object key is required to transform date')
      })
    })

    context('when valid key', () => {
      it('should return a function', () => {
        const actual = this.transformers.transformDateObjectToDateString('start_date')

        expect(actual).to.be.a('function')
      })
    })

    context('when valid key with inner call', () => {
      it('should return empty string for incorrect object', () => {
        expect(this.transformers.transformDateObjectToDateString('start_date')()).to.be.null
        expect(this.transformers.transformDateObjectToDateString('start_date')({})).to.be.null
        expect(this.transformers.transformDateObjectToDateString('start_date')({ a: 'v' })).to.be.null
        expect(this.transformers.transformDateObjectToDateString('start_date')({ year: '123124' })).to.be.null
        expect(this.transformers.transformDateObjectToDateString('start_date')({ year: '2017' })).to.be.null
      })

      it('should return date string for correct object', () => {
        const dateObj = {
          start_date_year: '2017',
          start_date_month: '09',
          start_date_day: '25',
        }
        const actual = this.transformers.transformDateObjectToDateString('start_date')(dateObj)

        expect(actual).to.equal('2017-09-25')
      })

      it('should return partial date string for object', () => {
        const actualYearMonth = this.transformers.transformDateObjectToDateString('start_date')({
          start_date_year: '2017',
          start_date_month: '09',
        })
        const actualYear = this.transformers.transformDateObjectToDateString('start_date')({
          start_date_year: '2017',
        })

        expect(actualYearMonth).to.equal('2017-09-')
        expect(actualYear).to.equal('2017--')
      })
    })
  })

  describe('#transformDateStringToDateObject', () => {
    context('when invalid date string', () => {
      it('should return empty date object for no args', () => {
        const actual = this.transformers.transformDateStringToDateObject()

        expect(actual).to.deep.equal({
          year: '',
          month: '',
          day: '',
        })
      })

      it('should return empty date object for invalid date', () => {
        const actual = this.transformers.transformDateStringToDateObject('12345-098-11')

        expect(actual).to.deep.equal({
          year: '',
          month: '',
          day: '',
        })
      })
    })

    context('when valid date string', () => {
      it('should return correct date object from date string', () => {
        const actual = this.transformers.transformDateStringToDateObject('2017-09-25')

        expect(actual).to.deep.equal({
          year: '2017',
          month: '09',
          day: '25',
        })
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
      const actual = this.transformers.transformApiResponseToCollection()(this.mockResponse)

      expect(actual).to.have.property('count', 2)
      expect(actual).to.have.property('items').to.be.an('array').and.have.length(2)
      expect(actual).to.have.property('pagination')
      expect(this.buildPaginationSpy).to.be.called
    })

    context('when an item transformer is specified with arguments', () => {
      beforeEach(() => {
        this.itemTransformerInnerSpy = sinon.spy()
        this.itemTransformerSpy = sinon.stub().returns(this.itemTransformerInnerSpy)
        this.itemTransformerOptions = { query: { term: 'bobby' } }

        this.transformers.transformApiResponseToCollection(
          undefined,
          this.itemTransformerSpy(this.itemTransformerOptions)
        )(this.mockResponse)
      })

      it('call the item transformer with the arguments', () => {
        expect(this.itemTransformerSpy).to.be.calledWith(this.itemTransformerOptions)
      })
    })

    context('when there are multiple item transformers', () => {
      beforeEach(() => {
        this.firstItemTransformerStub = sinon.stub()
          .onCall(0).returns({ id: '0' })
          .onCall(1).returns({ id: '1' })

        this.secondItemTransformerStub = sinon.stub()
          .onCall(0).returns({ id: 'a0' })
          .onCall(1).returns({ id: 'a1' })

        this.result = this.transformers.transformApiResponseToCollection(
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
        const itemTransformerStub = sinon.stub()
          .onCall(0).returns(undefined)
          .onCall(1).returns({ id: '1' })

        this.result = this.transformers.transformApiResponseToCollection(
          undefined,
          itemTransformerStub
        )(this.mockResponse)
      })

      it('should filter out undefined items', () => {
        expect(this.result.items).to.deep.equal([{ id: '1' }])
      })
    })
  })
})
