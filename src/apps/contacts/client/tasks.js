import axios from 'axios'
import urls from '../../../lib/urls'

export const getContactInteractionList = (contactId) =>
  axios.get(urls.contacts.activity.data(contactId)).then(({ data }) => data)
