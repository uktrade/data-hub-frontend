const metadata = require('../../../lib/metadata')
const { transformObjectToOption, transformStringToOption } = require('../../transformers')

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

const foreignOtherCompanyOptions = [
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

const standardFormConfig = {
  children: [
    {
      macroName: 'TextField',
      name: 'name',
      label: 'Company name',
      placeholder: 'e.g. Hooli',
    },
    {
      macroName: 'TextField',
      name: 'description',
      label: 'Describe yourself',
      placeholder: 'Lorem ipsum',
      type: 'textarea',
      hint: 'A few words about yourself',
      optional: true,
    },
    globalFields.countries,
    globalFields.sectors,
    globalFields.strategicDrivers,
    globalFields.averageSalary,
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'feedbackType',
      modifier: 'inline',
      label: 'Inline inputs',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      macroName: 'Fieldset',
      legend: 'Inline text fields',
      children: [
        {
          macroName: 'TextField',
          name: 'subFirstName',
          label: 'First name',
          modifier: 'inline',
        },
        {
          macroName: 'TextField',
          name: 'subLastName',
          label: 'Last name',
          modifier: 'inline',
        },
      ],
    },
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'businessType',
      label: 'Company type',
      options: [
        {
          value: 'ltd',
          label: 'UK private or public limited company',
          hint: 'Must be a company registered with Companies House',
        }, {
          value: 'ukother',
          label: 'Other type of UK organisation',
          hint: 'UK organisation not registered with Companies House',
          children: [
            Object.assign({}, globalFields.foreignOtherCompany, {
              modifier: 'subfield',
              condition: {
                name: 'businessType',
                value: 'ukother',
              },
            }),
          ],
        }, {
          value: 'foreign',
          label: 'Foreign organisation',
        },
      ],
    },
    {
      macroName: 'Fieldset',
      legend: 'A set of fields',
      children: [
        {
          macroName: 'TextField',
          name: 'firstName',
          label: 'First name',
        },
        {
          macroName: 'TextField',
          name: 'lastName',
          label: 'Last name',
        },
      ],
    },
    {
      macroName: 'DateFieldset',
      name: 'land_date',
      label: 'What is the date?',
      hint: 'Enter today’s date',
      value: {
        year: '',
        month: '',
        day: '',
      },
    },
  ],
}

const entitySearchConfig = {
  inputName: 'term',
  inputLabel: 'Search for a company name or contact',
}

module.exports = {
  globalFields,
  standardFormConfig,
  entitySearchConfig,
}
