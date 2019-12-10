const faker = require('faker')

const canAddCountries = require('../can-add-countries')

const { THEMES } = require('../../constants')

const FLAG_NAME = 'interaction-add-countries'

function generateInteraction () {
  return { id: faker.random.uuid() }
}

describe('canAddCountries', () => {
  let flags = {}

  context('With the feature flag is true', () => {
    before(() => {
      flags[ FLAG_NAME ] = true
    })

    context('When the theme is export or other', () => {
      context('When there is an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.EXPORT, generateInteraction(), flags)).to.equal(false)
          expect(canAddCountries(THEMES.OTHER, generateInteraction(), flags)).to.equal(false)
        })
      })

      context('When there is NOT an interaction', () => {
        it('returns true', () => {
          expect(canAddCountries(THEMES.EXPORT, undefined, flags)).to.equal(true)
          expect(canAddCountries(THEMES.OTHER, undefined, flags)).to.equal(true)
        })
      })
    })

    context('When the theme is something else', () => {
      context('When there is an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.INVESTMENT, generateInteraction(), flags)).to.equal(false)
          expect(canAddCountries('test', generateInteraction(), flags)).to.equal(false)
        })
      })

      context('When there is NOT an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.INVESTMENT, undefined, flags)).to.equal(false)
          expect(canAddCountries('test', undefined, flags)).to.equal(false)
        })
      })
    })
  })

  context('With the feature flag is false', () => {
    before(() => {
      flags[ FLAG_NAME ] = false
    })

    context('When the theme is export or other', () => {
      context('When there is an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.EXPORT, generateInteraction(), flags)).to.equal(false)
          expect(canAddCountries(THEMES.OTHER, generateInteraction(), flags)).to.equal(false)
        })
      })
      context('When there is NOT an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.EXPORT, undefined, flags)).to.equal(false)
          expect(canAddCountries(THEMES.OTHER, undefined, flags)).to.equal(false)
        })
      })
    })

    context('When the theme is something else', () => {
      context('When there is an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.INVESTMENT, generateInteraction(), flags)).to.equal(false)
          expect(canAddCountries('test', generateInteraction(), flags)).to.equal(false)
        })
      })
      context('When there is NOT an interaction', () => {
        it('returns false', () => {
          expect(canAddCountries(THEMES.INVESTMENT, undefined, flags)).to.equal(false)
          expect(canAddCountries('test', undefined, flags)).to.equal(false)
        })
      })
    })
  })
})
