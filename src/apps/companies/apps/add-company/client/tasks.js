import axios from 'axios'
import { catchApiError } from '../../../../../client/components/Task/utils'

export default (postcode) =>
  axios
    .get(`/api/postcode-to-region-lookup/${postcode}`)
    .catch(catchApiError)
    .then(({ data }) => data)
