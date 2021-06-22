export const LABELS = {
  eventName: 'Event name',
  organiser: 'Organiser',
  country: 'Country',
  ukRegion: 'UK region',
}

export const SORT_OPTIONS = [
  {
    name: 'Event name A-Z',
    value: 'name:asc',
  },
  {
    name: 'Recently updated',
    value: 'modified_on:desc',
  },
  {
    name: 'Least recently updated',
    value: 'modified_on:asc',
  },
  {
    name: 'Earliest start date',
    value: 'start_date:asc',
  },
  {
    name: 'Latest start date',
    value: 'start_date:desc',
  },
]
