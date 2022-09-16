import axios from 'axios'
import urls from '../../../../lib/urls'
import {
  transformResponseToEventAventriDetails,
  transformAventriEventAttendeesRegistionStatusToBolean,
} from '../transformers'
import { EVENT_AVENTRI_DETAILS_REGISTRATION_STATUSES } from '../../../../apps/companies/apps/activity-feed/constants'

export const getEventAventriDetails = (aventriEventId) =>
  Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      params: {
        sortBy: 'first_name:asc',
        page: 1,
        registrationStatus:
          EVENT_AVENTRI_DETAILS_REGISTRATION_STATUSES.attended,
      },
    }),
  ])
    .then(([{ data }, { data: attendees }]) => ({
      ...transformResponseToEventAventriDetails(data),
      attended:
        transformAventriEventAttendeesRegistionStatusToBolean(attendees),
    }))
    .catch(() => Promise.reject('Unable to load aventri event details.'))
