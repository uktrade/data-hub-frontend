const filters = require('../filters')

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
        this.highlightedString = filters.highlight(this.mockString, {
          url: 'invalid',
        })
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
          expect(this.highlightedString.val).to.equal(
            'Here is an <span class="u-highlight">exam</span>ple phrase'
          )
        })
      })

      context('and when told to highlight only exact match', () => {
        beforeEach(() => {
          this.highlightedString = filters.highlight(
            this.mockString,
            'exam',
            true
          )
        })

        it('should not highlight a partial match', () => {
          expect(this.highlightedString.val).to.equal(this.mockString)
        })
      })
    })

    context('when passed a term that is not found', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(
          this.mockString,
          'example term'
        )
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
        expect(this.highlightedString.val).to.equal(
          'Here is an <span class="u-highlight">exam</span>ple phrase'
        )
      })
    })

    context('when search term start with +', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '+exam')
      })

      it('ignore the + in the term', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is an <span class="u-highlight">exam</span>ple phrase'
        )
      })
    })

    context('when search term starts with ?', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '?exam')
      })

      it('should ignore the ? in the term', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is an <span class="u-highlight">exam</span>ple phrase'
        )
      })
    })

    context('when search term starts with &', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '&exam')
      })

      it('should ignore the & in the term', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is an <span class="u-highlight">exam</span>ple phrase'
        )
      })
    })

    context('when search term starts with <', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, '<exam')
      })

      it('should ignore the < in the term', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is an <span class="u-highlight">exam</span>ple phrase'
        )
      })
    })

    context('when search term is only one word', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(this.mockString, ' example ')
      })

      it('should highlight only a word', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is an<span class="u-highlight"> example </span>phrase'
        )
      })
    })

    context('when search term is a text', () => {
      beforeEach(() => {
        this.highlightedString = filters.highlight(
          this.mockString,
          'Here is an example phrase'
        )
      })

      it('should highlight matched text', () => {
        expect(this.highlightedString.val).to.equal(
          '<span class="u-highlight">Here is an example phrase</span>'
        )
      })
    })

    context('when search result contains hazardous characters', () => {
      beforeEach(() => {
        this.mockString = 'Here is <>an example phrase'
        this.highlightedString = filters.highlight(this.mockString, 'example')
      })

      it('should escape the characters and transform them into character entity references', () => {
        expect(this.highlightedString.val).to.equal(
          'Here is &lt;&gt;an <span class="u-highlight">example</span> phrase'
        )
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

      const pluralisedString = filters.pluralise(
        singularString,
        0,
        customPluralisedString
      )

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

      const pluralisedString = filters.pluralise(
        singularString,
        1,
        customPluralisedString
      )

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
          const formattedDate = filters.formatDate('1/5/2010', 'dd/MM/yy')

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
          const formattedDate = filters.formatDateTime(
            '2017-08-16T14:18:28',
            'dd/MM/yy HH:mm'
          )

          expect(formattedDate).to.equal('16/08/17 14:18')
        })
      })
    })
  })

  describe('#formatAddress', () => {
    context('when all address fields are populated', () => {
      beforeEach(() => {
        this.actual = filters.formatAddress({
          line_1: 'line 1',
          line_2: 'line 2',
          town: 'town',
          county: 'county',
          postcode: 'postcode',
          country: {
            name: 'country',
          },
        })
      })

      it('should format the address as a comma separated list', () => {
        expect(this.actual).to.equal(
          'line 1, line 2, town, county, postcode, country'
        )
      })
    })

    context('when minimal address fields are populated', () => {
      beforeEach(() => {
        this.actual = filters.formatAddress({
          line_1: 'line 1',
          line_2: '',
          town: 'town',
          county: '',
          postcode: 'postcode',
          country: {
            name: 'country',
          },
        })
      })

      it('should format the address as a comma separated list', () => {
        expect(this.actual).to.equal('line 1, town, postcode, country')
      })
    })

    context('when the address does not exist', () => {
      beforeEach(() => {
        this.actual = filters.formatAddress(null)
      })

      it('should format the address as a comma separated list', () => {
        expect(this.actual).to.not.exist
      })
    })

    context('when specifying a custom join', () => {
      beforeEach(() => {
        this.actual = filters.formatAddress(
          {
            line_1: 'line 1',
            line_2: '',
            town: 'town',
            county: '',
            postcode: 'postcode',
            country: {
              name: 'country',
            },
          },
          '<br />'
        )
      })

      it('should format the address as a comma separated list', () => {
        expect(this.actual).to.equal(
          'line 1<br />town<br />postcode<br />country'
        )
      })
    })
  })

  describe('#applyClassModifiers', () => {
    it('should return original class name when no valid modifier is given', () => {
      expect(
        filters.applyClassModifiers('c-custom-component', undefined)
      ).to.equal('c-custom-component')
      expect(filters.applyClassModifiers('c-custom-component', {})).to.equal(
        'c-custom-component'
      )
      expect(
        filters.applyClassModifiers('c-custom-component', { a: 'A' })
      ).to.equal('c-custom-component')
    })

    it('should return original class name and BEM modifier for modifier string', () => {
      expect(
        filters.applyClassModifiers('c-custom-component', 'modifier')
      ).to.equal('c-custom-component c-custom-component--modifier')
    })

    it('should return original class name and BEM modifier for modifiers array', () => {
      expect(
        filters.applyClassModifiers('c-custom-component', [
          'modifier',
          'another-modifier',
        ])
      ).to.equal(
        'c-custom-component c-custom-component--modifier c-custom-component--another-modifier'
      )
    })
  })
})
