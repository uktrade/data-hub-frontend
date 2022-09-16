const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

import { EVENT_AVENTRI_DETAILS_REGISTRATION_STATUSES } from '../../../../apps/companies/apps/activity-feed/constants'

export const getEventAventriAttended = ({
  aventriEventId,
  selectedSortBy,
  page,
}) =>
  Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      params: {
        sortBy: selectedSortBy,
        page,
        registrationStatus:
          EVENT_AVENTRI_DETAILS_REGISTRATION_STATUSES.attended,
      },
    }),
  ])
    .then(([{ data: aventriEventData }, { data: attendeesData }]) => ({
      aventriEventData,
      ...attendeesData,
    }))
    .catch(() => Promise.reject('Unable to load Aventri Attended.'))
