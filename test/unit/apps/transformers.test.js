describe('Global transformers', () => {
  beforeEach(() => {
    this.buildPaginationSpy = sandbox.spy()

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

    it('should return a collection object with items transformed by given transformer with arguments', () => {
      const itemTransformerInnerSpy = sandbox.spy()
      const itemTransformerSpy = sandbox.stub().returns(itemTransformerInnerSpy)
      const itemTransformerOptions = { query: { term: 'bobby' } }

      const actual = this.transformers.transformApiResponseToCollection(
        undefined,
        itemTransformerSpy(itemTransformerOptions)
      )(this.mockResponse)

      expect(itemTransformerInnerSpy).to.be.calledTwice
      expect(itemTransformerSpy).to.be.calledWith(itemTransformerOptions)
      expect(actual).to.have.property('items').to.have.length(2)
    })

    it('should return a collection object with items transformed by multiple transformers', () => {
      const firstItemTransformerSpy = sandbox.spy()
      const secondItemTransformerSpy = sandbox.spy()

      const actual = this.transformers.transformApiResponseToCollection(
        undefined,
        firstItemTransformerSpy,
        secondItemTransformerSpy
      )(this.mockResponse)

      expect(firstItemTransformerSpy).to.be.calledTwice
      expect(secondItemTransformerSpy).to.be.calledTwice
      expect(actual).to.have.property('items').to.have.length(2)
    })
  })
})
