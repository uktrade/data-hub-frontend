import axios from 'axios'

import urls from '../../../../lib/urls'

export const getContactActivities = ({ contactId, page, selectedSortBy }) =>
  axios
    .get(urls.contacts.activity.data(contactId), {
      params: { page, selectedSortBy },
    })
    .then(({ data }) => data)
    .catch(() => Promise.reject('Unable to load contact activity.'))
