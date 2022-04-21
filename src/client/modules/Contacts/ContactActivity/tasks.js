import axios from 'axios'
import urls from '../../../../lib/urls'

export const getContactActivities = ({ contactId, page }) =>
  axios
    .get(urls.contacts.activity.data(contactId), { params: { page } })
    .then(({ data }) => data)
    .catch(() => Promise.reject('Unable to load contact activity.'))
