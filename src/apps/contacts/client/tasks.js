import axios from 'axios'
import urls from '../../../lib/urls'

export const getContactInteractions = (contactId) =>
  axios
    .get(urls.contacts.activity.data(contactId))
    .then(({ data }) => data)
    .catch(() => Promise.reject('Unable to load Contact Interactions.'))
