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
    hint: 'fields.primary_market.hint',
    validate: 'required',
    initialOption: '-- Select market --',
    options: [],
    supportingContent: 'fields.primary_market.supportingContent',
  },
  subscribers: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.subscribers.legend',
    label: 'fields.subscribers.label',
    hint: 'fields.subscribers.hint',
    addButtonText: 'fields.subscribers.addButtonText',
    optional: true,
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
}
