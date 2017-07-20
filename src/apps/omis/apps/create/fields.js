module.exports = {
  'company': {
    fieldType: 'HiddenField',
    validate: 'required',
  },
  'contact': {
    fieldType: 'MultipleChoiceField',
    label: 'Company contact',
    hint: 'Select a contact for the company',
    validate: 'required',
    initialOption: '-- Select contact --',
    options: [],
  },
  'primary_market': {
    fieldType: 'MultipleChoiceField',
    label: 'Primary market',
    hint: 'The market which should be providing the service',
    validate: 'required',
    initialOption: '-- Select market --',
    options: [],
  },
  'ita': {
    fieldType: 'MultipleChoiceField',
    label: 'International Trade Adviser (optional)',
    hint: 'The ITA responsible for overseeing the work from a UK region',
    initialOption: '-- Select adviser --',
    options: [],
  },
}
