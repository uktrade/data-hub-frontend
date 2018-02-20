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
        { value: 'date:desc', label: 'Newest' },
        { value: 'company.name:asc', label: 'Company: A-Z' },
        { value: 'contact.name:asc', label: 'Contact: A-Z' },
        { value: 'dit_adviser.name:asc', label: 'Adviser: A-Z' },
        { value: 'dit_adviser.name:desc', label: 'Adviser: Z-A' },
        { value: 'subject:asc', label: 'Subject: A-Z' },
      ],
    },
  ],
}
