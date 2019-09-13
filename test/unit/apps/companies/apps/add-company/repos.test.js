const config = require('~/config')
const { fetchForeignCountries, fetchOrganisationTypes } = require('~/src/apps/companies/apps/add-company/repos')
const countriesFixture = require('../../../../data/metadata/country')
const businessTypeFixture = require('../../../../data/metadata/business-type')
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

  describe('#fetchOrganisationTypes', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/metadata/business-type/')
        .reply(200, businessTypeFixture)

      this.actual = await fetchOrganisationTypes(token)
    })

    it('should return the organisation types', () => {
      expect(this.actual).to.deep.equal([
        {
          value: '9dd14e94-5d95-e211-a939-e4115bead28a',
          label: 'Charity',
        },
        {
          value: '9cd14e94-5d95-e211-a939-e4115bead28a',
          label: 'Government department or other public body',
        },
        {
          value: '98d14e94-5d95-e211-a939-e4115bead28a',
          label: 'Limited company',
        },
        {
          value: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
          label: 'Limited partnership',
        },
        {
          value: '9ad14e94-5d95-e211-a939-e4115bead28a',
          label: 'Partnership',
        },
        {
          value: '99d14e94-5d95-e211-a939-e4115bead28a',
          label: 'Sole Trader',
        },
      ])
    })
  })
})
