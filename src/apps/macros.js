const metadata = require('../lib/metadata')
const { transformObjectToOption, transformStringToOption } = require('./transformers')

const foreignOtherCompanyOptions = [
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

const globalFields = {
  countries: {
    macroName: 'MultipleChoiceField',
    name: 'country',
    label: 'Country',
    initialOption: '-- Select country --',
    options () {
      return metadata.countryOptions.map(transformObjectToOption)
    },
  },

  ukRegions: {
    macroName: 'MultipleChoiceField',
    name: 'uk_region',
    label: 'UK Region',
    initialOption: '-- Select region --',
    options () {
      return metadata.regionOptions.map(transformObjectToOption)
    },
  },

  sectors: {
    macroName: 'MultipleChoiceField',
    name: 'sector',
    label: 'Sectors',
    initialOption: '-- Select sector --',
    options () {
      return metadata.sectorOptions.map(transformObjectToOption)
    },
  },

  strategicDrivers: {
    macroName: 'MultipleChoiceField',
    name: 'strategicDrivers',
    label: 'Strategic drivers',
    options () {
      return metadata.strategicDriverOptions.map(transformObjectToOption)
    },
  },

  averageSalary: {
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'averageSalary',
    label: 'Average salary range',
    options () {
      return metadata.salaryRangeOptions.map(transformObjectToOption)
    },
  },

  foreignOtherCompany: {
    macroName: 'MultipleChoiceField',
    name: 'foreignOtherCompany',
    label: 'Type of organisation',
    initialOption: '-- Select organisation type --',
    options () {
      return foreignOtherCompanyOptions.map(transformStringToOption)
    },
  },
}

module.exports = {
  globalFields,
}
