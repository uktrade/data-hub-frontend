describe('Global transformers', () => {
  beforeEach(() => {
    this.transformers = require('../transformers')
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
        const actual =
          this.transformers.transformDateObjectToDateString('start_date')

        expect(actual).to.be.a('function')
      })
    })

    context('when valid key with inner call', () => {
      it('should return empty string for incorrect object', () => {
        expect(
          this.transformers.transformDateObjectToDateString('start_date')()
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({})
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            a: 'v',
          })
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            year: '123124',
          })
        ).to.be.null
        expect(
          this.transformers.transformDateObjectToDateString('start_date')({
            year: '2017',
          })
        ).to.be.null
      })

      it('should return date string for correct object', () => {
        const dateObj = {
          start_date_year: '2017',
          start_date_month: '09',
          start_date_day: '25',
        }
        const actual =
          this.transformers.transformDateObjectToDateString('start_date')(
            dateObj
          )

        expect(actual).to.equal('2017-09-25')
      })

      it('should return partial date string for object', () => {
        const actualYearMonth =
          this.transformers.transformDateObjectToDateString('start_date')({
            start_date_year: '2017',
            start_date_month: '09',
          })
        const actualYear = this.transformers.transformDateObjectToDateString(
          'start_date'
        )({
          start_date_year: '2017',
        })

        expect(actualYearMonth).to.equal('2017-09-')
        expect(actualYear).to.equal('2017--')
      })
    })
  })

  describe('#transformCountryToOptionWithIsoCode', () => {
    it('should return object with id, name as label and code as value', () => {
      const actual = this.transformers.transformCountryToOptionWithIsoCode({
        id: '1',
        name: 'France',
        iso_alpha2_code: 'FR',
      })

      expect(actual).to.deep.equal({
        key: '1',
        label: 'France',
        value: 'FR',
      })
    })
  })
})
