import axios from 'axios'

import urls from '../../../../lib/urls'
import { transformResponseToEventAventriDetails } from '../transformers'

export const paramsGetAventriEventAttendeeStatus = (status) => ({
  params: {
    sortBy: 'first_name:asc',
    page: 1,
    size: 0,
    registrationStatus: status,
  },
})

export const getEventAventriDetails = (aventriEventId) =>
  Promise.all([axios.get(urls.events.aventri.detailsData(aventriEventId))])
    .then(([{ data }]) => ({
      ...transformResponseToEventAventriDetails(data),
    }))
    .catch(() => Promise.reject('Unable to load aventri event details.'))
