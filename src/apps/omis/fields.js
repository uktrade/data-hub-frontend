module.exports = {
  company: {
    fieldType: 'HiddenField',
    validate: 'required',
  },
  contact: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.contact.label',
    hint: 'fields.contact.hint',
    validate: 'required',
    initialOption: '-- Select contact --',
    options: [],
  },
  primary_market: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.primary_market.label',
    hint: 'fields.primary_market.hint',
    validate: 'required',
    initialOption: '-- Select market --',
    options: [],
  },
  subscribers: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.subscribers.legend',
    label: 'fields.subscribers.label',
    addButtonText: 'fields.subscribers.addButtonText',
    optional: true,
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
}
