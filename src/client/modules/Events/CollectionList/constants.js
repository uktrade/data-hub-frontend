export const LABELS = {
  eventName: 'Event name',
  organiser: 'Organiser',
  startDateAfter: 'From',
  startDateBefore: 'To',
  country: 'Country',
  ukRegion: 'UK region',
  eventType: 'Type of event',
  relatedProgrammes: 'Related programme',
  earliestStartDate: 'Earliest start date',
  latestStartDate: 'Latest start date',
  aventriId: 'Aventri ID',
}

export const AVENTRI_ID_MAX_LENGTH = 9

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

export const COLLECTION_LIST_SORT_SELECT_OPTIONS = [
  {
    name: 'Recently updated',
    value: 'modified_on:desc',
  },
  {
    name: 'Least recently updated',
    value: 'modified_on:asc',
  },
  {
    name: 'Event name A-Z',
    value: 'name:asc',
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
