export const ATTENDEES_SORT_OPTIONS = [
  {
    name: 'First name: A-Z',
    value: 'first_name:asc',
  },
  {
    name: 'First name: Z-A',
    value: 'first_name:desc',
  },
  {
    name: 'Last name: A-Z',
    value: 'last_name:asc',
  },
  {
    name: 'Last name: Z-A',
    value: 'last_name:desc',
  },
  {
    name: 'Company name: A-Z',
    value: 'company_name:asc',
  },
  {
    name: 'Company name: Z-A',
    value: 'company_name:desc',
  },
]

const EVENT_ATTENDEES_STATUS = {
  registered: 'Registered',
  waitingList: 'Waiting list',
  didNotAttend: 'Did not attend',
  attended: 'Attended',
  cancelled: 'Cancelled',
}

const EVENT_AVENTRI_ATTENDEES_STATUS = {
  activated: 'Activated',
  attended: 'Attended',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  noShow: 'No Show',
  waitlist: 'Waitlist',
}

const createMappingObject = (status, aventriStatuses) => ({
  [status]: {
    statuses: aventriStatuses,
    urlSlug: status.replaceAll(' ', '-').toLowerCase(),
  },
})

export const EVENT_ATTENDEES_MAPPING = [
  createMappingObject(EVENT_ATTENDEES_STATUS.registered, [
    EVENT_AVENTRI_ATTENDEES_STATUS.activated,
    EVENT_AVENTRI_ATTENDEES_STATUS.confirmed,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.cancelled, [
    EVENT_AVENTRI_ATTENDEES_STATUS.cancelled,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.attended, [
    EVENT_AVENTRI_ATTENDEES_STATUS.attended,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.didNotAttend, [
    EVENT_AVENTRI_ATTENDEES_STATUS.noShow,
  ]),
  createMappingObject(EVENT_ATTENDEES_STATUS.waitingList, [
    EVENT_AVENTRI_ATTENDEES_STATUS.waitlist,
  ]),
].reduce((a, v) => ({ ...a, ...v }), {})
