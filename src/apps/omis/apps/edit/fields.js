const globalFields = require('../../fields')

const editFields = Object.assign({}, globalFields, {
  service_types: {
    fieldType: 'MultipleChoiceField',
    type: 'checkbox',
    label: 'fields.service_types.label',
    options: [],
  },
  description: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.description.label',
  },
  sector: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.sector.label',
    optional: true,
    initialOption: '-- Select sector --',
    options: [],
  },
  delivery_date: {
    fieldType: 'TextField',
    label: 'fields.delivery_date.label',
    hint: 'fields.delivery_date.hint',
    modifier: 'short',
    validate: ['date', 'after'],
  },
  contacts_not_to_approach: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.contacts_not_to_approach.label',
    optional: true,
  },
})

module.exports = editFields
