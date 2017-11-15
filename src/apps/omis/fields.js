module.exports = {
  company: {
    validate: 'required',
  },
  contact: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.contact.label',
    validate: 'required',
    initialOption: '-- Select contact --',
    options: [],
  },
  primary_market: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.primary_market.label',
    validate: 'required',
    initialOption: '-- Select country --',
    options: [],
    supportingContent: 'fields.primary_market.supportingContent',
  },
  use_sector_from_company: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    modifier: ['inline'],
    validate: 'required',
    label: 'fields.use_sector_from_company.label',
    options: [{
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    }],
  },
  sector: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.sector.label',
    modifier: ['subfield'],
    validate: 'required',
    initialOption: '-- Select sector --',
    options: [],
    condition: {
      name: 'use_sector_from_company',
      value: 'false',
    },
    dependent: {
      field: 'use_sector_from_company',
      value: 'false',
    },
  },
  subscribers: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.subscribers.legend',
    label: 'fields.subscribers.label',
    hint: 'fields.subscribers.hint.create',
    addButtonText: 'fields.subscribers.addButtonText',
    optional: true,
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
}
