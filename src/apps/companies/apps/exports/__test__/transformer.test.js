const proxyquire = require('proxyquire')
const faker = require('faker')

const minimalCompany = require('../../../../../../test/unit/data/companies/minimal-company.json')

const transformerPath = '../transformer'
const EXPORT_POTENTIAL_LABEL = 'Export potential'

const {
  generateExportCountries,
} = require('../../../../../../test/unit/helpers/generate-export-countries')

describe('transformCompanyToExportDetailsView', () => {
  let transformCompanyToExportDetailsView
  let urls
  let greatUrlProfileResponse

  beforeEach(() => {
    greatUrlProfileResponse = faker.internet.url()
    urls = {
      external: {
        greatProfile: sinon.stub().returns(greatUrlProfileResponse),
      },
    }
    transformCompanyToExportDetailsView = proxyquire(transformerPath, {
      '../../../../lib/urls': urls,
    })
  })

  context('when there is no feature flag', () => {
    context('when no export market information has been entered', () => {
      it('should create the correct viewRecord data', () => {
        const company = {
          ...minimalCompany,
          export_experience_category: null,
          export_to_countries: [],
          future_interest_countries: [],
        }

        const viewRecord = transformCompanyToExportDetailsView(company)

        expect(viewRecord).to.have.property('Currently exporting to', 'None')
        expect(viewRecord).to.have.property(
          'Future countries of interest',
          'None'
        )
        expect(viewRecord).to.have.property('Export win category', 'None')
        expect(viewRecord).to.have.property(
          EXPORT_POTENTIAL_LABEL,
          'No score given'
        )
        expect(viewRecord).not.to.have.property('Countries of no interest')
      })
    })

    context(
      'when single values have been selected for drop down fields',
      () => {
        it('should create the correct viewRecord data', () => {
          const exportExperienceCategory = {
            id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
            name: 'Increasing export markets',
          }
          const company = {
            ...minimalCompany,
            export_experience_category: exportExperienceCategory,
            export_to_countries: [
              {
                id: '1234',
                name: 'France',
              },
            ],
            future_interest_countries: [
              {
                id: '4321',
                name: 'Germany',
              },
            ],
            export_potential_score: 'low',
          }

          const viewRecord = transformCompanyToExportDetailsView(company)

          expect(viewRecord).to.have.property(
            'Currently exporting to',
            'France'
          )
          expect(viewRecord).to.have.property(
            'Future countries of interest',
            'Germany'
          )
          expect(viewRecord).to.have.property(
            'Export win category',
            exportExperienceCategory
          )
          expect(viewRecord).to.have.property(EXPORT_POTENTIAL_LABEL, 'Low')
        })
      }
    )

    context(
      'when multiple values have been selected for drop down fields',
      () => {
        it('should create the correct viewRecord data', () => {
          const exportExperienceCategory = {
            id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
            name: 'Increasing export markets',
          }
          const company = {
            ...minimalCompany,
            export_experience_category: exportExperienceCategory,
            export_to_countries: [
              {
                id: '1234',
                name: 'France',
              },
              {
                id: '5511',
                name: 'Spain',
              },
            ],
            future_interest_countries: [
              {
                id: '4321',
                name: 'Germany',
              },
              {
                id: '4123',
                name: 'Sweden',
              },
            ],
          }

          const viewRecord = transformCompanyToExportDetailsView(company)

          expect(viewRecord).to.have.property(
            'Currently exporting to',
            'France, Spain'
          )
          expect(viewRecord).to.have.property(
            'Future countries of interest',
            'Germany, Sweden'
          )
          expect(viewRecord).to.have.property(
            'Export win category',
            exportExperienceCategory
          )
        })
      }
    )

    describe('great profile', () => {
      const GREAT_LABEL = 'great.gov.uk business profile'
      let companiesHouseNumber

      function createRecord(props) {
        return transformCompanyToExportDetailsView({
          ...minimalCompany,
          export_experience_category: null,
          export_to_countries: [],
          future_interest_countries: [],
          company_number: companiesHouseNumber,
          ...props,
        })
      }

      beforeEach(() => {
        companiesHouseNumber = faker.random.alphaNumeric(8)
      })

      context('when a profile is published', () => {
        it('should return the data to link to the profile', () => {
          const viewRecord = createRecord({ great_profile_status: 'published' })
          const data = viewRecord[GREAT_LABEL]

          expect(data).to.have.property('url', greatUrlProfileResponse)
          expect(data).to.have.property('newWindow', true)
          expect(data).to.have.property('name', '"Find a supplier" profile')
          expect(data).to.have.property('hint', '(opens in a new window)')

          expect(urls.external.greatProfile).to.have.been.calledWith(
            companiesHouseNumber
          )
        })
      })

      context('when a profile is unpublished', () => {
        it('should return the label and data', () => {
          const viewRecord = createRecord({
            great_profile_status: 'unpublished',
          })
          expect(viewRecord).to.have.property(
            GREAT_LABEL,
            'Profile not published'
          )
        })
      })

      context('without a profile', () => {
        it('should return the label and data', () => {
          const viewRecord = createRecord({ great_profile_status: null })
          expect(viewRecord).to.have.property(GREAT_LABEL, 'No profile')
        })
      })
    })
  })

  context('when the interaction-add-countries feature flag is true', () => {
    context('when multiple countries have been added', () => {
      it('should show the countries', () => {
        const {
          future,
          current,
          noInterest,
          exportCountries,
        } = generateExportCountries()

        const company = {
          ...minimalCompany,
          export_countries: exportCountries,
        }

        function getCountryText(countries) {
          return countries.map(([, name]) => name).join(', ')
        }

        const viewRecord = transformCompanyToExportDetailsView(company, true)

        expect(viewRecord).to.have.property(
          'Currently exporting to',
          getCountryText(current)
        )
        expect(viewRecord).to.have.property(
          'Future countries of interest',
          getCountryText(future)
        )
        expect(viewRecord).to.have.property(
          'Countries of no interest',
          getCountryText(noInterest)
        )
      })
    })
  })
})
