module.exports = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'deadline:desc', label: 'Closest to deadline' },
        { value: 'proposition.name:asc', label: 'Proposition: A-Z' },
        { value: 'adviser.name:asc', label: 'Adviser: A-Z' },
        { value: 'adviser.name:desc', label: 'Adviser: Z-A' },
        { value: 'scope:asc', label: 'Scope: A-Z' },
      ],
    },
  ],
}
