const options = [
  { value: '-date', label: 'Newest' },
  { value: 'company__name', label: 'Company: A-Z' },
  { value: 'subject', label: 'Subject: A-Z' },
]

const interactionSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      options,
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
    },
  ],
}

const defaultInteractionSort = options[0].value

module.exports = {
  interactionSortForm,
  defaultInteractionSort,
}
