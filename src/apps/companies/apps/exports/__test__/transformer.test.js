const faker = require('faker')

const minimalCompany = require('../../../../../../test/unit/data/companies/minimal-company.json')

const transformCompanyToExportDetailsView = require('../transformer')

const {
  generateExportCountries,
} = require('../../../../../../test/unit/helpers/generate-export-countries')

describe('transformCompanyToExportDetailsView', () => {
  context('when no export market information has been entered', () => {
    it('should create the correct viewRecord data', () => {
      const company = {
        ...minimalCompany,
        export_experience_category: null,
        export_to_countries: [],
        future_interest_countries: [],
      }

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportPotential: {
          name: 'Export potential',
          value: undefined,
        },
        exportWinCategory: {
          name: 'Export win category',
          value: null,
        },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportCountriesInformation: [
          { name: 'Currently exporting to', value: 'None' },
          { name: 'Future countries of interest', value: 'None' },
          { name: 'Countries of no interest', value: 'None' },
        ],
      })
    })
  })

  context('when single values have been selected for drop down fields', () => {
    it('should create the correct viewRecord data', () => {
      const exportExperienceCategory = {
        id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
        name: 'Increasing export markets',
      }
      const company = {
        ...minimalCompany,
        export_experience_category: exportExperienceCategory,
        export_countries: [
          {
            country: {
              id: '1234',
              name: 'France',
            },
            status: 'currently_exporting',
          },
          {
            country: {
              id: '4321',
              name: 'Germany',
            },
            status: 'future_interest',
          },
        ],
        export_potential: 'low',
      }

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportPotential: {
          name: 'Export potential',
          value: 'Low',
        },
        exportWinCategory: {
          name: 'Export win category',
          value: 'Increasing export markets',
        },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportCountriesInformation: [
          { name: 'Currently exporting to', value: 'France' },
          { name: 'Future countries of interest', value: 'Germany' },
          { name: 'Countries of no interest', value: 'None' },
        ],
      })
    })
  })

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
          export_countries: [
            {
              country: {
                id: '1234',
                name: 'France',
              },
              status: 'currently_exporting',
            },
            {
              country: {
                id: '5511',
                name: 'Spain',
              },
              status: 'currently_exporting',
            },
            {
              country: {
                id: '4321',
                name: 'Germany',
              },
              status: 'future_interest',
            },
            {
              country: {
                id: '4123',
                name: 'Sweden',
              },
              status: 'future_interest',
            },
          ],
        }

        const viewRecord = transformCompanyToExportDetailsView(company)

        expect(viewRecord).to.deep.equal({
          exportPotential: {
            name: 'Export potential',
            value: undefined,
          },
          exportWinCategory: {
            name: 'Export win category',
            value: 'Increasing export markets',
          },
          greatProfile: {
            name: 'great.gov.uk business profile',
            value: undefined,
          },
          exportCountriesInformation: [
            { name: 'Currently exporting to', value: 'France, Spain' },
            {
              name: 'Future countries of interest',
              value: 'Germany, Sweden',
            },
            { name: 'Countries of no interest', value: 'None' },
          ],
        })
      })
    }
  )

  describe('great profile', () => {
    const companiesHouseNumber = faker.random.alphaNumeric(8)

    function createRecord(props) {
      return transformCompanyToExportDetailsView({
        ...minimalCompany,
        company_number: companiesHouseNumber,
        ...props,
      })
    }

    context('when a profile is published', () => {
      it('should return the data to link to the profile', () => {
        const viewRecord = createRecord({ great_profile_status: 'published' })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: 'published',
        })
      })
    })

    context('when a profile is unpublished', () => {
      it('should return the label and data', () => {
        const viewRecord = createRecord({
          great_profile_status: 'unpublished',
        })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: 'unpublished',
        })
      })
    })

    context('without a profile', () => {
      it('should return the label and data', () => {
        const viewRecord = createRecord({ great_profile_status: undefined })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: undefined,
        })
      })
    })
  })

  context('when multiple countries have been added in all categories', () => {
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

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportWinCategory: { name: 'Export win category', value: null },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportPotential: { name: 'Export potential', value: undefined },
        exportCountriesInformation: [
          {
            name: 'Currently exporting to',
            value: getCountryText(current),
          },
          {
            name: 'Future countries of interest',
            value: getCountryText(future),
          },
          {
            name: 'Countries of no interest',
            value: getCountryText(noInterest),
          },
        ],
      })
    })
  })
})
