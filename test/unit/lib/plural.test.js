const { pluralise, singularise } = require('~/src/lib/plural')

describe('#pluralise', () => {
  it('should return pluralised string when count is 0', () => {
    const singularString = 'result'

    const pluralisedString = pluralise(singularString, 0)

    expect(pluralisedString).to.equal(`${singularString}s`)
  })

  it('should return singular string string when count is 1', () => {
    const singularString = 'result'

    const pluralisedString = pluralise(singularString, 1)

    expect(pluralisedString).to.equal(singularString)
  })

  it('should return pluralised custom string when count is 0', () => {
    const singularString = 'company'
    const customPluralisedString = 'companies'

    const pluralisedString = pluralise(singularString, 0, customPluralisedString)

    expect(pluralisedString).to.equal(customPluralisedString)
  })

  it('should return a correctly pluralised string  using the (general) English rule CONSONANT + Y = CONSONANT + IES', () => {
    const singularString = 'company'
    const pluralString = 'companies'
    const pluralisedString = pluralise(singularString, 0)

    expect(pluralisedString).to.equal(pluralString)
  })

  it('should NOT convert a word ending VOWEL + Y to VOWEL + IES', () => {
    const singularString = 'sunday'
    const pluralString = 'sundays'
    const pluralisedString = pluralise(singularString, 0)

    expect(pluralisedString).to.equal(pluralString)
  })

  it('should return singular custom string when count is 1', () => {
    const singularString = 'company'
    const customPluralisedString = 'companies'

    const pluralisedString = pluralise(singularString, 1, customPluralisedString)

    expect(pluralisedString).to.equal(singularString)
  })
})

describe('#singularise', () => {
  context('when the count is > 1', () => {
    beforeEach(() => {
      this.singular = singularise('Companies', 10)
    })

    it('should return the original word', () => {
      expect(this.singular).to.equal('Companies')
    })
  })

  context('when the count is 1', () => {
    beforeEach(() => {
      this.count = 1
    })

    context('and a singular word is provided', () => {
      beforeEach(() => {
        this.singular = singularise('Companies', this.count, 'Ducks')
      })

      it('should use the word provided', () => {
        expect(this.singular).to.equal('Ducks')
      })
    })

    context('and the word ends in ies', () => {
      beforeEach(() => {
        this.singular = singularise('Companies', this.count)
      })

      it('should strip the ies and replace it with y', () => {
        expect(this.singular).to.equal('Company')
      })
    })

    context('and the word ends just in s', () => {
      beforeEach(() => {
        this.singular = singularise('Contacts', this.count)
      })

      it('should strip the s at the end', () => {
        expect(this.singular).to.equal('Contact')
      })
    })
  })
})
