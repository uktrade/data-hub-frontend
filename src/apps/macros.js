const { sortBy } = require('lodash')
const metadata = require('../lib/metadata')
const {
  transformObjectToOption,
  transformStringToOption,
  transformHQCodeToLabelledOption,
} = require('./transformers')

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
    options() {
      return metadata.countryOptions.map(transformObjectToOption)
    },
  },

  ukRegions: {
    macroName: 'MultipleChoiceField',
    name: 'uk_region',
    label: 'UK Region',
    initialOption: '-- Select region --',
    options() {
      return metadata.regionOptions.map(transformObjectToOption)
    },
  },

  headquarter_type: {
    macroName: 'MultipleChoiceField',
    name: 'headquarter_type',
    type: 'checkbox',
    label: 'Type',
    options() {
      return sortBy(
        metadata.headquarterOptions.map(transformHQCodeToLabelledOption),
        ['order', 'label', 'value']
      )
    },
  },

  sectors: {
    macroName: 'MultipleChoiceField',
    name: 'sector_descends',
    label: 'Sectors',
    initialOption: '-- Select sector --',
    options() {
      return metadata.sectorOptions.map(transformObjectToOption)
    },
  },

  strategicDrivers: {
    macroName: 'MultipleChoiceField',
    name: 'strategic_drivers',
    label: 'Strategic drivers',
    initialOption: '-- Select strategic driver --',
    options() {
      return metadata.strategicDriverOptions.map(transformObjectToOption)
    },
  },

  averageSalary: {
    macroName: 'MultipleChoiceField',
    type: 'radio',
    name: 'average_salary',
    label: 'Average salary range',
    options() {
      return metadata.salaryRangeOptions.map(transformObjectToOption)
    },
  },

  foreignOtherCompany: {
    macroName: 'MultipleChoiceField',
    name: 'foreign_other_company',
    label: 'Type of organisation',
    initialOption: '-- Select organisation type --',
    options() {
      return foreignOtherCompanyOptions.map(transformStringToOption)
    },
  },

  eventTypes: {
    macroName: 'MultipleChoiceField',
    name: 'event_type',
    label: 'Type of event',
    initialOption: '-- Select event type --',
    options() {
      return metadata.eventTypeOptions.map(transformObjectToOption)
    },
  },

  locationTypes: {
    macroName: 'MultipleChoiceField',
    name: 'location_type',
    label: 'Location type',
    initialOption: '-- Select event --',
    options() {
      return metadata.locationTypeOptions.map(transformObjectToOption)
    },
  },

  serviceDeliveryServices: {
    macroName: 'MultipleChoiceField',
    name: 'service',
    label: 'Service',
    initialOption: '-- Select service --',
    options() {
      return metadata.serviceDeliveryServiceOptions.map(transformObjectToOption)
    },
  },

  teams: {
    macroName: 'MultipleChoiceField',
    name: 'team',
    label: 'Team',
    initialOption: '-- Select team --',
    options() {
      return metadata.teams.map(transformObjectToOption)
    },
  },

  programmes: {
    macroName: 'MultipleChoiceField',
    name: 'programme',
    label: 'Programme',
    initialOption: '-- Select programme --',
    options() {
      return metadata.programmeOptions.map(transformObjectToOption)
    },
  },

  tradeAgreements: {
    macroName: 'MultipleChoiceField',
    name: 'related_trade_agreements',
    label: 'Related Trade Agreements',
    initialOption: '-- Select related trade agreement --',
    options: [
      {
        label: 'Australia',
        value: '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
      },
      {
        label: 'Canada',
        value: '50cf99fd-1150-421d-9e1c-b23750ebf5ca',
      },
      {
        label: 'India',
        value: '95ca9dcb-0da5-4bc2-a139-3e5b55c882f7',
      },
      {
        label: 'Japan',
        value: '05587f64-b976-425e-8763-3557c7936632',
      },
      {
        label: 'Mexico',
        value: '09787712-0d94-4137-a5f3-3f9131e681f0',
      },
      {
        label: 'New Zealand',
        value: 'f42da892-2b03-4f88-8a61-9efd8b132776',
      },
      {
        label: 'USA',
        value: '20e08a38-95a8-4250-bd5b-9d7f0dfc9387',
      },
    ],
  },
}

module.exports = {
  globalFields,
}
