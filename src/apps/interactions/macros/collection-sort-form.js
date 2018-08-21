const options = [
  { value: '-date', label: 'Newest' },
  { value: 'company__name', label: 'Company: A-Z' },
  { value: 'contact__first_name,contact__last_name', label: 'Contact: A-Z' },
  { value: 'dit_adviser__first_name,dit_adviser__last_name', label: 'Adviser: A-Z' },
  { value: '-dit_adviser__first_name,-dit_adviser__last_name', label: 'Adviser: Z-A' },
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
