import axios from 'axios'
import transformFullExportHistory from './transformer'

const handleError = (e) => Promise.reject(Error(e.response.data.detail))

export const fetchExportsHistory = (companyId) =>
  axios
    .post('/api-proxy/v4/search/export-country-history', {
      body: {
        company: companyId,
      },
    })
    .catch(handleError)
    .then(({ data }) => transformFullExportHistory(data))
