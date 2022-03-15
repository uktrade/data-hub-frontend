import axios from 'axios'
import { isEmpty } from 'lodash'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const LABELS = {
  30: '30 days before',
  60: '60 days before',
}

const transformEstimatedLandDate = (estimatedLandDate) =>
  isEmpty(estimatedLandDate)
    ? ['None']
    : estimatedLandDate.map((value) => LABELS[value])

export const getNotificationSettings = (investment) =>
  axios
    .get(`/api-proxy/v3/investment/${investment.id}/notification`)
    .then(({ data }) => ({
      estimatedLandDate: transformEstimatedLandDate(data.estimated_land_date),
    }))
    .catch(handleError)
