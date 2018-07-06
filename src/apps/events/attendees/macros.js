const attendeeSortOptions = [
  { value: 'contact__last_name,contact__first_name', label: 'Last name: A-Z' },
  { value: '-contact__last_name,-contact__first_name', label: 'Last name: Z-A' },
  { value: 'contact__first_name,contact__last_name', label: 'First name: A-Z' },
  { value: '-contact__first_name,-contact__last_name', label: 'First name: Z-A' },
  { value: 'company__name,contact__last_name,contact__first_name', label: 'Company: A-Z' },
  { value: '-company__name,contact__last_name,contact__first_name', label: 'Company: Z-A' },
  { value: '-date,contact__last_name,contact__first_name', label: 'Recently attended' },
  { value: 'date,contact__last_name,contact__first_name', label: 'Least recently attended' },
]

const attendeeSortForm = {
  method: 'get',
  class: 'c-collection__sort-form js-AutoSubmit',
  hideFormActions: true,
  children: [
    {
      macroName: 'MultipleChoiceField',
      label: 'Sort by',
      name: 'sortby',
      modifier: ['small', 'inline', 'light'],
      options: attendeeSortOptions,
    },
  ],
}

const defaultAttendeeSort = attendeeSortOptions[0].value

module.exports = {
  attendeeSortForm,
  attendeeSortOptions,
  defaultAttendeeSort,
}
