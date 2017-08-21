const filters = require('~/config/nunjucks/filters')

describe('nunjucks filters', () => {
  describe('#highlight', () => {
    it('should not render highlight for empty string', () => {
      const searchTerm = ''
      const mockString = 'we should see nothing highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString).to.equal('we should see nothing highlighted here')
    })

    it('should not render highlight for string with white space', () => {
      const searchTerm = ' '
      const mockString = 'we should see nothing highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString).to.equal('we should see nothing highlighted here')
    })

    it('should render string with partial highlight (default)', () => {
      const searchTerm = 'examp'
      const mockString = 'we should see example term highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(`we should see <span class="u-highlight">examp</span>le term highlighted here`)
    })

    it('should render string only with full word highlight', () => {
      const searchTerm = 'example term'
      const mockString = 'we should see example term highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm, true)

      expect(highlightedString.val).to.equal(`we should see <span class="u-highlight">example term</span> highlighted here`)
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
  })

  describe('#formatDate', () => {
    context('when given an invalid date', () => {
      it('should return input value', () => {
        const formattedDate = filters.formatDate('not-a-date')

        expect(formattedDate).to.equal('not-a-date')
      })
    })

    context('when given a valid date', () => {
      context('when no format is specified', () => {
        it('should return date in default format', () => {
          const formattedDate = filters.formatDate('1/5/2010')

          expect(formattedDate).to.equal('5 January 2010')
        })
      })

      context('when a format is specified', () => {
        it('should return date in that format', () => {
          const formattedDate = filters.formatDate('1/5/2010', 'DD/MM/YY')

          expect(formattedDate).to.equal('05/01/10')
        })
      })
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

  describe('#applyClassModifiers', () => {
    it('should return original class name when no valid modifier is given', () => {
      expect(filters.applyClassModifiers('c-custom-component', undefined)).to.equal('c-custom-component')
      expect(filters.applyClassModifiers('c-custom-component', {})).to.equal('c-custom-component')
      expect(filters.applyClassModifiers('c-custom-component', { a: 'A' })).to.equal('c-custom-component')
    })

    it('should return original class name and BEM modifier for modifier string', () => {
      expect(filters.applyClassModifiers('c-custom-component', 'modifier'))
        .to.equal('c-custom-component c-custom-component--modifier')
    })

    it('should return original class name and BEM modifier for modifiers array', () => {
      expect(filters.applyClassModifiers('c-custom-component', ['modifier', 'another-modifier']))
        .to.equal('c-custom-component c-custom-component--modifier c-custom-component--another-modifier')
    })
  })
})
