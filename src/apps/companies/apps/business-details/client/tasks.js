import axios from 'axios'

const {
  isDateAfter,
  subtractDays,
  today,
} = require('../../../../../client/utils/date')

export function checkIfPendingRequest(duns_number) {
  if (duns_number) {
    return axios
      .get(`/v4/dnb/company-change-request?duns_number=${duns_number}`)
      .then(({ data }) => checkIfRequestIsValid(data))
  }
  return false
}

const isDNBDateValid = (date) => {
  const todaysDate = today()
  const timeInterval = subtractDays(todaysDate, 20)
  return isDateAfter(date, timeInterval)
}

const checkIfRequestIsValid = ({ count, results }) => {
  if (count > 0) {
    const validRequests = results.filter(
      (result) =>
        ['pending', 'submitted'].includes(result.status) &&
        isDNBDateValid(result.created_on)
    )
    return validRequests.length > 0
  }
  return false
}

export function archiveSubmitCallback({ urls, values }) {
  return axios({
    method: 'POST',
    url: urls.companyArchive,
    data: values,
  })
}
