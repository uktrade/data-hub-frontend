const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

import {
  EVENT_AVENTRI_ATTENDEES_STATUS,
  EVENT_ATTENDEES_STATUS,
} from '../../../../apps/companies/apps/activity-feed/constants'

export const getEventAventriRegistrationStatusAttendees = ({
  aventriEventId,
  aventriRegistrationStatuses,
  selectedSortBy,
  page,
  size,
}) =>
  Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    axios.get(urls.events.aventri.registrationStatusData(aventriEventId), {
      params: {
        sortBy: selectedSortBy,
        page,
        size,
        registrationStatuses: aventriRegistrationStatuses,
      },
    }),
  ])
    .then(([{ data: aventriEventData }, { data: attendeesData }]) => ({
      aventriEventData,
      ...attendeesData,
    }))
    .catch(() => Promise.reject('Unable to load Aventri Registration Status.'))
