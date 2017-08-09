const SORT_OPTIONS = [
  { value: 'created_on:desc', label: 'Newest' },
  { value: 'created_on:asc', label: 'Oldest' },
  { value: 'modified_on:desc', label: 'Recently updated' },
  { value: 'modified_on:asc', label: 'Least recently updated' },
  { value: 'name:asc', label: 'Last name: ascending' },
  { value: 'name:desc', label: 'Last name: descending' },
  { value: 'address_country.name:asc', label: 'Country: ascending' },
  { value: 'address_country.name:desc', label: 'Country: descending' },
  { value: 'company.name:asc', label: 'Company: ascending' },
  { value: 'company.name:desc', label: 'Company: descending' },
]

module.exports = {
  SORT_OPTIONS,
}
