const filters = require('~/config/nunjucks/filters')

describe('nunjucks filters', () => {
  describe('#highlight', () => {
    it('should render string with highlight', () => {
      const searchTerm = 'example term'
      const mockString = `we should see ${searchTerm} highlighted here`

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(`we should see <span class="u-highlight">${searchTerm}</span> highlighted here`)
    })

    it('should render string without highlight', () => {
      const searchTerm = 'example term'
      const mockString = 'we should not see another term highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(mockString)
    })
  })

  describe('#removeNilAndEmpty', () => {
    it('should remove nil and empty values from array', () => {
      const mockArrayWithEmpties = [
        0,
        null,
        undefined,
        '',
        'example value',
        false,
        'another example value',
      ]

      const actual = filters.removeNilAndEmpty(mockArrayWithEmpties)

      expect(actual).to.deep.equal([
        0,
        'example value',
        false,
        'another example value',
      ])
    })

    it('should remove nil and empty values from object', () => {
      const mockObjectWithEmpties = {
        a: true,
        b: null,
        c: undefined,
        d: 'false',
        e: 'value',
        f: '',
        g: false,
        h: [],
        i: {},
      }

      const actual = filters.removeNilAndEmpty(mockObjectWithEmpties)

      expect(actual).to.deep.equal({
        a: true,
        d: 'false',
        e: 'value',
        g: false,
      })
    })
  })

  describe('#pluralise', () => {
    it('should return pluralised string when count is 0', () => {
      const singularString = 'result'

      const pluralisedString = filters.pluralise(singularString, 0)

      expect(pluralisedString).to.equal(`${singularString}s`)
    })

    it('should return singular string string when count is 1', () => {
      const singularString = 'result'

      const pluralisedString = filters.pluralise(singularString, 1)

      expect(pluralisedString).to.equal(singularString)
    })

    it('should return pluralised custom string when count is 0', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = filters.pluralise(singularString, 0, customPluralisedString)

      expect(pluralisedString).to.equal(customPluralisedString)
    })

    it('should return singular custom string when count is 1', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = filters.pluralise(singularString, 1, customPluralisedString)

      expect(pluralisedString).to.equal(singularString)
    })
  })

  describe('#formatNumber', () => {
    it('should correctly format number for "en-GB" locale', () => {
      const formattedNumber = filters.formatNumber(12345678.1)

      expect(formattedNumber).to.equal('12,345,678.1')
    })

    it('should correctly format number for "de-DE" locale', () => {
      const formattedNumber = filters.formatNumber(12345678.1, 'de-DE')

      expect(formattedNumber).to.equal('12.345.678,1')
    })
  })

  describe('#collectionDefault', () => {
    const mockObjectWithEmpties = {
      a: true,
      b: null,
      c: undefined,
      d: 'false',
      e: 'value',
      f: '',
      g: false,
      h: [],
      i: {},
    }
    const mockArrayWithEmpties = Object.values(mockObjectWithEmpties)

    function expectedWithDefaults (expectedDefault, isArray = false) {
      const expected = {
        a: true,
        b: expectedDefault,
        c: expectedDefault,
        d: 'false',
        e: 'value',
        f: expectedDefault,
        g: expectedDefault,
        h: expectedDefault,
        i: expectedDefault,
      }

      if (isArray) {
        return Object.values(expected)
      }
      return expected
    }

    it('should correctly provide default for empty values in object', () => {
      const expectedDefault = 'Not found'
      const collectionDefault = filters.collectionDefault(mockObjectWithEmpties)

      expect(collectionDefault).to.deep.equal(expectedWithDefaults(expectedDefault))
    })

    it('should correctly provide argument default for empty values in object', () => {
      const argumentDefault = 'Currently unknown'
      const collectionDefault = filters.collectionDefault(mockObjectWithEmpties, argumentDefault)

      expect(collectionDefault).to.deep.equal(expectedWithDefaults(argumentDefault))
    })

    it('should correctly provide argument default for empty values in array', () => {
      const argumentDefault = 'This is really not known'
      const collectionDefault = filters.collectionDefault(mockArrayWithEmpties, argumentDefault)

      expect(collectionDefault).to.deep.equal(expectedWithDefaults(argumentDefault, true))
    })
  })
})
