import axios from 'axios'
import moment from 'moment'

export function checkIfPendingRequest(duns_number) {
  if (duns_number) {
    return axios
      .get(
        `/api-proxy/v4/dnb/company-change-request?duns_number=${duns_number}&status=pending`
      )
      .then(({ data }) => checkIfRequestIsValid(data))
  }
  return false
}

const checkIfRequestIsValid = ({ count, results }) => {
  if (count > 0) {
    const timeInterval = moment().subtract(20, 'days')
    const validRequests = results.filter(
      (result) =>
        result.status === 'pending' &&
        moment(result.created_on).isAfter(timeInterval)
    )
    return validRequests.length > 0
  }
  return false
}
