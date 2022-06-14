import axios from 'axios'
import urls from '../../../../lib/urls'

export const getAventriEventDetails = (id) => {
  return axios
    .get(urls.events.aventri.data(id))
    .then(({ data }) => data)
    .catch(() => Promise.reject('Unable to load contact activity.'))
}
