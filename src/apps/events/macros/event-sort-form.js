const eventSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit js-FilterSort',
  hideFormActions: true,
  hiddenFields: { custom: true },
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: [
        { value: 'name:asc', label: 'Event name: A-Z' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'start_date:asc', label: 'Earliest start date' },
        { value: 'start_date:desc', label: 'Latest start date' },
      ],
    },
  ],
}

module.exports = eventSortForm
