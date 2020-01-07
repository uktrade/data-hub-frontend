const attendeeSortOptions = [
  {
    value: 'last_name_of_first_contact,first_name_of_first_contact',
    label: 'Last name: A-Z',
  },
  {
    value: '-last_name_of_first_contact,-first_name_of_first_contact',
    label: 'Last name: Z-A',
  },
  {
    value: 'first_name_of_first_contact,last_name_of_first_contact',
    label: 'First name: A-Z',
  },
  {
    value: '-first_name_of_first_contact,-last_name_of_first_contact',
    label: 'First name: Z-A',
  },
  {
    value:
      'company__name,last_name_of_first_contact,first_name_of_first_contact',
    label: 'Company: A-Z',
  },
  {
    value:
      '-company__name,last_name_of_first_contact,first_name_of_first_contact',
    label: 'Company: Z-A',
  },
  {
    value: '-date,last_name_of_first_contact,first_name_of_first_contact',
    label: 'Recently attended',
  },
  {
    value: 'date,last_name_of_first_contact,first_name_of_first_contact',
    label: 'Least recently attended',
  },
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
