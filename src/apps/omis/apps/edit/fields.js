const { isArray } = require('lodash')

const globalFields = require('../../fields')

function isDuration (value) {
  const regex = /^\d+:\d{2}$/

  if (!isArray(value)) {
    if (!value) { return true }

    return !!value.match(regex)
  }

  let valid = true
  value.forEach(itemValue => {
    if (!itemValue) { return }

    if (!itemValue.match(regex)) {
      valid = false
    }
  })

  return valid
}

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
  assignees: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.assignees.legend',
    label: 'fields.assignees.label',
    addButtonText: 'fields.assignees.addButtonText',
    optional: true,
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
  assignee_time: {
    fieldType: 'TextField',
    label: 'fields.assignee_time.label',
    modifier: ['shorter', 'soft'],
    validate: [isDuration],
  },
})

module.exports = editFields
