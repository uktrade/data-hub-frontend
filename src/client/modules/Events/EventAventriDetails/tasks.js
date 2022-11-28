import axios from 'axios'
import urls from '../../../../lib/urls'
import {
  transformResponseToEventAventriDetails,
  transformAventriEventAttendeesRegistionStatusToBolean,
} from '../transformers'
import { EVENT_AVENTRI_ATTENDEES_STATUS } from '../../../../apps/companies/apps/activity-feed/constants'

export const paramsGetAventriEventAttendeeStatus = (status) => ({
  params: {
    sortBy: 'first_name:asc',
    page: 1,
    size: 0,
    registrationStatus: status,
  },
})

export const getEventAventriDetails = (aventriEventId) =>
  Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    // axios.get(urls.events.aventri.attendedData(aventriEventId), {
    //   ...paramsGetAventriEventAttendeeStatus(
    //     EVENT_AVENTRI_ATTENDEES_STATUS.attended
    //   ),
    // }),
  ])
    .then(([{ data }]) => ({
      ...transformResponseToEventAventriDetails(data),
      // attended:
      //   transformAventriEventAttendeesRegistionStatusToBolean(attendees),
    }))
    .catch(() => Promise.reject('Unable to load aventri event details.'))
