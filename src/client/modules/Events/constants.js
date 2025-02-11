export const ATTENDEE_SORT_OPTIONS = [
  { name: 'Last name: A-Z', value: 'last_name_of_first_contact' },
  { name: 'Last name: Z-A', value: '-last_name_of_first_contact' },
  { name: 'First name: A-Z', value: 'first_name_of_first_contact' },
  { name: 'First name: Z-A', value: '-first_name_of_first_contact' },
  { name: 'Company name: A-Z', value: 'company__name' },
  { name: 'Company name: Z-A', value: '-company__name' },
  { name: 'Recently added', value: '-created_on' },
  { name: 'Least recently added', value: 'created_on' },
]
