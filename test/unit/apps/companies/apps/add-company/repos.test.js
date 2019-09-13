const config = require('~/config')
const { fetchForeignCountries } = require('~/src/apps/companies/apps/add-company/repos')
const countriesFixture = require('../../../../data/metadata/country')
const { transformObjectToOption } = require('~/src/apps/transformers')

const token = 'abcd'

describe('Add company form repos', () => {
  describe('#fetchForeignCountries', () => {
    context('when "domesticCountry" is not set', () => {
      const foreignCountriesFixture = countriesFixture
        .filter(c => c.name !== 'United Kingdom')
        .map(transformObjectToOption)

      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/metadata/country/')
          .reply(200, countriesFixture)

        this.results = await fetchForeignCountries({ token })
      })

      it('should return countries excluding "United Kingdom"', () => {
        expect(this.results).to.be.deep.equal(foreignCountriesFixture)
      })
    })

    context('when "domesticCountry" is Italy', () => {
      const foreignCountriesFixture = countriesFixture
        .filter(c => c.name !== 'Italy')
        .map(transformObjectToOption)

      beforeEach(async () => {
        nock(config.apiRoot)
          .get('/metadata/country/')
          .reply(200, countriesFixture)

        this.results = await fetchForeignCountries({ token, domesticCountry: 'Italy' })
      })

      it('should return countries excluding "Italy"', () => {
        expect(this.results).to.be.deep.equal(foreignCountriesFixture)
      })
    })
  })
})
