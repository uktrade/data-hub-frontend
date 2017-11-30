const filters = require('~/config/nunjucks/filters')

describe('nunjucks filters', () => {
  beforeEach(() => {
    this.mockString = 'Here is an example phrase'
  })

  describe('#highlight', () => {
    context('when search term is empty', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '')
      })
      it('should not render any highlights', () => {
        expect(this.highlightedString).to.equal(this.mockString)
      })
    })

    context('when search term contains white space', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, ' ')
      })
      it('should not render any highlights', () => {
        expect(this.highlightedString).to.equal(this.mockString)
      })
    })

    context('when the search term is not a string', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, { url: 'invalid' })
      })
      it('should return the original string', () => {
        expect(this.highlightedString).to.equal(this.mockString)
      })
    })

    context('when passed a term with a partial match', () => {
      context('and when called with default parameters', () => {
        beforeEach(() => {
          this.highlightedString = filters.highlight(this.mockString, 'exam')
        })

        it('should highlight a partial match', () => {
          expect(this.highlightedString.val).to.equal('Here is an <span class="u-highlight">exam</span>ple phrase')
        })
      })

      context('and when told to highlight only exact match', () => {
        beforeEach(() => {
          this.highlightedString = filters.highlight(this.mockString, 'exam', true)
        })

        it('should not highlight a partial match', () => {
          expect(this.highlightedString.val).to.equal(this.mockString)
        })
      })
    })

    context('when passed a term that is not found', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, 'example term')
      })
      it('should not render any highlights', () => {
        expect(this.highlightedString.val).to.equal(this.mockString)
      })
    })

    context('when the term is surrounded by *', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '*exam*')
      })

      it('should ignore the * in the term', () => {
        expect(this.highlightedString.val).to.equal('Here is an <span class="u-highlight">exam</span>ple phrase')
      })
    })

    context('when search term start with +', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '+exam')
      })

      it('ignore the + in the term', () => {
        expect(this.highlightedString.val).to.equal('Here is an <span class="u-highlight">exam</span>ple phrase')
      })
    })

    context('when search term starts with ?', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '?exam')
      })

      it('should ignore the ? in the term', () => {
        expect(this.highlightedString.val).to.equal('Here is an <span class="u-highlight">exam</span>ple phrase')
      })
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

    it('should return a correctly pluralised string  using the (general) English rule CONSONANT + Y = CONSONANT + IES', () => {
      const singularString = 'company'
      const pluralString = 'companies'
      const pluralisedString = filters.pluralise(singularString, 0)

      expect(pluralisedString).to.equal(pluralString)
    })

    it('should NOT convert a word ending VOWEL + Y to VOWEL + IES', () => {
      const singularString = 'sunday'
      const pluralString = 'sundays'
      const pluralisedString = filters.pluralise(singularString, 0)

      expect(pluralisedString).to.equal(pluralString)
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

  describe('#formatDateTime', () => {
    context('when given an invalid datetime', () => {
      it('should return input value', () => {
        const formattedDate = filters.formatDateTime('not-a-date')

        expect(formattedDate).to.equal('not-a-date')
      })
    })

    context('when given a valid datetime', () => {
      context('when no format is specified', () => {
        it('should return datetime in default format', () => {
          const formattedDate = filters.formatDateTime('2017-08-01T14:18:28')

          expect(formattedDate).to.equal('1 Aug 2017, 2:18pm')
        })
      })

      context('when a format is specified', () => {
        it('should return datetime in that format', () => {
          const formattedDate = filters.formatDateTime('2017-08-16T14:18:28', 'DD/MM/YY HH:mm')

          expect(formattedDate).to.equal('16/08/17 14:18')
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

  describe('#humanizeDuration', () => {
    context('when hours is 1', () => {
      it('should return singular format', () => {
        expect(filters.humanizeDuration(60)).to.equal('1 hour')
      })
    })

    context('when hours is 0', () => {
      it('should return singular format', () => {
        expect(filters.humanizeDuration(0)).to.equal('0 hours')
      })
    })

    context('when hours is greater than 1', () => {
      it('should return plural format', () => {
        expect(filters.humanizeDuration(120)).to.equal('2 hours')
      })
    })

    context('when using a different format', () => {
      it('should return format as hours', () => {
        expect(filters.humanizeDuration(2, 'hours')).to.equal('2 hours')
      })
    })
  })
})
