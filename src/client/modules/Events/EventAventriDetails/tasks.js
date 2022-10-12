import axios from 'axios'
import urls from '../../../../lib/urls'
import {
  transformResponseToEventAventriDetails,
  transformAventriEventAttendeesRegistionStatusToBoolean,
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
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.attended
      ),
    }),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.activated
      ),
    }),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.confirmed
      ),
    }),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.noShow
      ),
    }),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.cancelled
      ),
    }),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.waitlist
      ),
    }),
  ])
    .then(
      ([
        { data },
        { data: attendees },
        { data: activated },
        { data: confirmed },
        { data: noShow },
        { data: cancelled },
        { data: waitlist },
      ]) => ({
        ...transformResponseToEventAventriDetails(data),
        attended:
          transformAventriEventAttendeesRegistionStatusToBoolean(attendees),
        activated:
          transformAventriEventAttendeesRegistionStatusToBoolean(activated),
        confirmed:
          transformAventriEventAttendeesRegistionStatusToBoolean(confirmed),
        noShow: transformAventriEventAttendeesRegistionStatusToBoolean(noShow),
        cancelled:
          transformAventriEventAttendeesRegistionStatusToBoolean(cancelled),
        waitlist:
          transformAventriEventAttendeesRegistionStatusToBoolean(waitlist),
      })
    )
    .catch(() => Promise.reject('Unable to load aventri event details.'))
