const { default: axios } = require('axios')
const urls = require('../../../../lib/urls')

import { EVENT_AVENTRI_ATTENDEES_STATUS } from '../../../../apps/companies/apps/activity-feed/constants'
import { paramsGetAventriEventAttendeeStatus } from '../EventAventriDetails/tasks'

export const getEventAventriAttended = ({ aventriEventId }) =>
  Promise.all([
    axios.get(urls.events.aventri.detailsData(aventriEventId)),
    axios.get(urls.events.aventri.attendedData(aventriEventId), {
      ...paramsGetAventriEventAttendeeStatus(
        EVENT_AVENTRI_ATTENDEES_STATUS.attended
      ),
    }),
  ])
    .then(([{ data: aventriEventData }, { data: attendeesData }]) => ({
      aventriEventData,
      ...attendeesData,
    }))
    .catch(() => Promise.reject('Unable to load Aventri Attended.'))
