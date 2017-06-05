
describe('nunjucks filters', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.filters = require('~/config/nunjucks/filters')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#highlight', () => {
    it('should render string with highlight', () => {
      const searchTerm = 'example term'
      const mockString = `we should see ${searchTerm} highlighted here`

      const highlightedString = this.filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(`we should see <span class="results-highlight">${searchTerm}</span> highlighted here`)
    })

    it('should render string without highlight', () => {
      const searchTerm = 'example term'
      const mockString = `we should not see another term highlighted here`

      const highlightedString = this.filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(mockString)
    })
  })

  describe('#removeFalsey', () => {
    it('should remove falsey values from array', () => {
      const mockArrayWithFalsies = [
        0,
        null,
        undefined,
        '',
        'example value',
        false,
        'another example value',
      ]

      const arrayWithoutFalsies = this.filters.removeFalsey(mockArrayWithFalsies)

      expect(arrayWithoutFalsies).to.deep.equal([
        'example value',
        'another example value',
      ])
    })
  })

  describe('#pluralise', () => {
    it('should return pluralised string when count is 0', () => {
      const singularString = 'result'

      const pluralisedString = this.filters.pluralise(singularString, 0)

      expect(pluralisedString).to.equal(`${singularString}s`)
    })

    it('should return singular string string when count is 1', () => {
      const singularString = 'result'

      const pluralisedString = this.filters.pluralise(singularString, 1)

      expect(pluralisedString).to.equal(singularString)
    })

    it('should return pluralised custom string when count is 0', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = this.filters.pluralise(singularString, 0, customPluralisedString)

      expect(pluralisedString).to.equal(customPluralisedString)
    })

    it('should return singular custom string when count is 1', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = this.filters.pluralise(singularString, 1, customPluralisedString)

      expect(pluralisedString).to.equal(singularString)
    })
  })

  describe('#formatNumber', () => {
    it('should correctly format number for "en-GB" locale', () => {
      const formattedNumber = this.filters.formatNumber(12345678)

      expect(formattedNumber).to.equal('12,345,678')
    })

    it('should correctly format number for "de-DE" locale', () => {
      const formattedNumber = this.filters.formatNumber(12345678, 'de-DE')

      expect(formattedNumber).to.equal('12,345,678')
    })
  })
})
