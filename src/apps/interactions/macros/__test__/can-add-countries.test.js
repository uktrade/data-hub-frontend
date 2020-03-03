const faker = require('faker')

const canAddCountries = require('../can-add-countries')

const { THEMES } = require('../../constants')

function generateInteraction() {
  return { id: faker.random.uuid() }
}

describe('canAddCountries', () => {
  context('When the theme is export or other', () => {
    context('When there is an interaction', () => {
      it('returns false', () => {
        expect(canAddCountries(THEMES.EXPORT, generateInteraction())).to.equal(
          false
        )
        expect(canAddCountries(THEMES.OTHER, generateInteraction())).to.equal(
          false
        )
      })
    })

    context('When there is NOT an interaction', () => {
      it('returns true', () => {
        expect(canAddCountries(THEMES.EXPORT, undefined)).to.equal(true)
        expect(canAddCountries(THEMES.OTHER, undefined)).to.equal(true)
      })
    })
  })

  context('When the theme is something else', () => {
    context('When there is an interaction', () => {
      it('returns false', () => {
        expect(
          canAddCountries(THEMES.INVESTMENT, generateInteraction())
        ).to.equal(false)
        expect(canAddCountries('test', generateInteraction())).to.equal(false)
      })
    })

    context('When there is NOT an interaction', () => {
      it('returns false', () => {
        expect(canAddCountries(THEMES.INVESTMENT, undefined)).to.equal(false)
        expect(canAddCountries('test', undefined)).to.equal(false)
      })
    })
  })
})
